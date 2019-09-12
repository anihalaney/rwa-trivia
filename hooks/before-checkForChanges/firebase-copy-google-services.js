
var path = require("path");
var fs = require("fs");

module.exports = function($logger, hookArgs) {
    return new Promise(function(resolve, reject) {

        /* do not add this line we do not use --release to decide release environment */
        // var isReleaseBuild = !!((hookArgs.checkForChangesOpts && hookArgs.checkForChangesOpts.projectChangesOptions) || hookArgs.prepareData).release;
        /* Decide whether to prepare for dev or prod environment */
        var validProdEnvs = ['prod','production'];
        var isProdEnv = false; // building with --env.prod or --env.production flag

        var env = ((hookArgs.checkForChangesOpts && hookArgs.checkForChangesOpts.projectData && hookArgs.checkForChangesOpts.projectData.$options && hookArgs.checkForChangesOpts.projectData.$options.argv) || hookArgs.prepareData).env;
        if (env) {
            Object.keys(env).forEach((key) => {
                if (validProdEnvs.indexOf(key)>-1) { isProdEnv=true; }
            });
        }


        // do not change this line 
        // we use --env.prod to decide release environment
        // we do not use --release to decide release environment
        var buildType = isProdEnv ? 'production' : 'development';

        /*
            Detect if we have nativescript-plugin-firebase temp file created during after-prepare hook, so we know
            for which environment {development|prod} the project was prepared. If needed, we delete the NS .nsprepareinfo
            file so we force a new prepare
        */
        var platform = (hookArgs.checkForChangesOpts || hookArgs.prepareData).platform.toLowerCase();
        var projectData = (hookArgs.checkForChangesOpts && hookArgs.checkForChangesOpts.projectData) || hookArgs.projectData;
        var platformsDir = projectData.platformsDir;
        var appResourcesDirectoryPath = projectData.appResourcesDirectoryPath;
        var forcePrepare = true; // whether to force NS to run prepare, defaults to true
        var npfInfoPath = path.join(platformsDir, platform, ".pluginfirebaseinfo");
        var nsPrepareInfoPath = path.join(platformsDir, platform, ".nsprepareinfo");
        var copyPlistOpts = { platform, appResourcesDirectoryPath, buildType, $logger }

        if (fs.existsSync(npfInfoPath)) {
            var npfInfo = undefined;
            try { npfInfo = JSON.parse(fs.readFileSync(npfInfoPath, 'utf8')); }
            catch (e) { $logger.info('nativescript-plugin-firebase: error reading '+npfInfoPath); }

            if (npfInfo && npfInfo.hasOwnProperty('buildType') && npfInfo.buildType===buildType) {
                $logger.info('nativescript-plugin-firebase: building for same environment, not forcing prepare.');
                forcePrepare=false;
            }
        } else { $logger.info('nativescript-plugin-firebase: '+npfInfoPath+' not found, forcing prepare!'); }

        if (forcePrepare) {
            $logger.info('nativescript-plugin-firebase: running release build or change in environment detected, forcing prepare!');

            if (fs.existsSync(npfInfoPath)) { fs.unlinkSync(npfInfoPath); }
            if (fs.existsSync(nsPrepareInfoPath)) { fs.unlinkSync(nsPrepareInfoPath); }

            if (copyPlist(copyPlistOpts)) { resolve(); } else { reject(); }
        } else { resolve(); }
    });
};

/*
    Handle preparing of Google Services files for iOS
*/
var copyPlist = function(copyPlistOpts) {
    if (copyPlistOpts.platform === 'android') { return true; }
    else if (copyPlistOpts.platform === 'ios') {
        var sourceGooglePlistProd = path.join(copyPlistOpts.appResourcesDirectoryPath, "iOS", "GoogleService-Info.plist.prod");
        var sourceGooglePlistDev = path.join(copyPlistOpts.appResourcesDirectoryPath, "iOS", "GoogleService-Info.plist.dev");
        var destinationGooglePlist = path.join(copyPlistOpts.appResourcesDirectoryPath, "iOS", "GoogleService-Info.plist");

        // if we have both dev/prod versions, we copy (or overwrite) GoogleService-Info.plist in destination dir
        if (fs.existsSync(sourceGooglePlistProd) && fs.existsSync(sourceGooglePlistDev)) {
            if (copyPlistOpts.buildType==='production') { // use prod version
                copyPlistOpts.$logger.info("nativescript-plugin-firebase: copy " + sourceGooglePlistProd + " to " + destinationGooglePlist + ".");
                fs.writeFileSync(destinationGooglePlist, fs.readFileSync(sourceGooglePlistProd));
                return true;
            } else { // use dev version
                copyPlistOpts.$logger.info("nativescript-plugin-firebase: copy " + sourceGooglePlistDev + " to " + destinationGooglePlist + ".");
                fs.writeFileSync(destinationGooglePlist, fs.readFileSync(sourceGooglePlistDev));
                return true;
            }
        } else if (!fs.existsSync(destinationGooglePlist)) { // single GoogleService-Info.plist modus but missing
            copyPlistOpts.$logger.warn("nativescript-plugin-firebase: " + destinationGooglePlist + " does not exist. Please follow the installation instructions from the documentation");
            return false;
        } else {
            return true; // single GoogleService-Info.plist modus
        }
    } else { return true; }
}
