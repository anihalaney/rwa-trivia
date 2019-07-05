
var path = require("path");
var fs = require("fs");

module.exports = function ($logger, $projectData, hookArgs) {
    return new Promise(function (resolve, reject) {

        /* Decide whether to prepare for dev or prod environment */

        //   var isReleaseBuild = (hookArgs.appFilesUpdaterOptions && hookArgs.appFilesUpdaterOptions.release) ? true : false;
        var validProdEnvs = ['prod', 'production'];
        var isProdEnv = false; // building with --env.prod or --env.production flag

        if (hookArgs.config.env) {
            Object.keys(hookArgs.config.env).forEach((key) => {
                if (validProdEnvs.indexOf(key) > -1) { isProdEnv = true; }
            });
        }

        var buildType = isProdEnv ? 'production' : 'development';

        /* Handle preparing of Android xml files */

        if (hookArgs.config.platforms[0].toLowerCase() === 'android') {

            // Replace facebooklogin.xml files with dev and prod environment

            var destinationFacebookLoginXml = path.join($projectData.appResourcesDirectoryPath, "Android", "values", "facebooklogin.xml");
            var destinationFacebookLoginXmlAlt = path.join($projectData.appResourcesDirectoryPath, "Android", "values", "facebooklogin.xml");
            var sourceFacebookLoginXml = path.join($projectData.projectDir, "configurations", "android", "facebooklogin.xml");
            var sourceFacebookLoginXmlProd = path.join($projectData.projectDir, "configurations", hookArgs.config.env.project, "android", "facebooklogin.prod.xml");
            var sourceFacebookLoginXmlDev = path.join($projectData.projectDir, "configurations", hookArgs.config.env.project, "android", "facebooklogin.dev.xml");
            var facebookFileExist = false;
            var stringsFileExist = false;

            // ensure we have both dev/prod versions so we never overwrite singular facebooklogin.xml
            if (fs.existsSync(sourceFacebookLoginXmlProd) && fs.existsSync(sourceFacebookLoginXmlDev)) {
                if (buildType === 'production') { sourceFacebookLoginXml = sourceFacebookLoginXmlProd; } // use prod version
                else { sourceFacebookLoginXml = sourceFacebookLoginXmlDev; } // use dev version
            }

            // copy correct version to destination
            if (fs.existsSync(sourceFacebookLoginXml) && fs.existsSync(path.dirname(destinationFacebookLoginXml))) {
                $logger.out("Copy " + sourceFacebookLoginXml + " to " + destinationFacebookLoginXml + ".");
                fs.writeFileSync(destinationFacebookLoginXml, fs.readFileSync(sourceFacebookLoginXml));
                facebookFileExist = true;
            } else if (fs.existsSync(sourceFacebookLoginXml) && fs.existsSync(path.dirname(destinationFacebookLoginXmlAlt))) {
                // NativeScript < 4 doesn't have the 'app' folder
                $logger.out("Copy " + sourceFacebookLoginXml + " to " + destinationFacebookLoginXmlAlt + ".");
                fs.writeFileSync(destinationFacebookLoginXmlAlt, fs.readFileSync(sourceFacebookLoginXml));
                facebookFileExist = true;
            } else {
                $logger.warn("Unable to copy facebooklogin.xml.");
                facebookFileExist = false;
                reject();
            }

            // Replace strings.xml files with dev and prod environment

            var destinationStringsXml = path.join($projectData.appResourcesDirectoryPath, "Android", "values", "strings.xml");
            var destinationStringsXmlAlt = path.join($projectData.appResourcesDirectoryPath, "Android", "values", "strings.xml");
            var sourceStringsXml = path.join($projectData.projectDir, "configurations", "android", "strings.xml");
            var sourceStringsXmlProd = path.join($projectData.projectDir, "configurations", hookArgs.config.env.project, "android", "strings.prod.xml");
            var sourceStringsXmlDev = path.join($projectData.projectDir, "configurations", hookArgs.config.env.project, "android", "strings.dev.xml");

            // ensure we have both dev/prod versions so we never overwrite singular strings.xml
            if (fs.existsSync(sourceStringsXmlProd) && fs.existsSync(sourceStringsXmlDev)) {
                if (buildType === 'production') { sourceStringsXml = sourceStringsXmlProd; } // use prod version
                else { sourceStringsXml = sourceStringsXmlDev; } // use dev version
            }

            // copy correct version to destination
            if (fs.existsSync(sourceStringsXml) && fs.existsSync(path.dirname(destinationStringsXml))) {
                $logger.out("Copy " + sourceStringsXml + " to " + destinationStringsXml + ".");
                fs.writeFileSync(destinationStringsXml, fs.readFileSync(sourceStringsXml));
                stringsFileExist = true;
            } else if (fs.existsSync(sourceStringsXml) && fs.existsSync(path.dirname(destinationStringsXmlAlt))) {
                // NativeScript < 4 doesn't have the 'app' folder
                $logger.out("Copy " + sourceStringsXml + " to " + destinationStringsXmlAlt + ".");
                fs.writeFileSync(destinationStringsXmlAlt, fs.readFileSync(sourceStringsXml));
                stringsFileExist = true;
            } else {
                $logger.warn("Unable to copy strings.xml.");
                stringsFileExist = false;
                reject();
            }

            if (facebookFileExist && stringsFileExist) {
                resolve();
            }

        } else {

            var platform = hookArgs.config.platforms[0].toLowerCase(); // ios | android
            var platformsDir = $projectData.platformsDir;

            var appResourcesDirectoryPath = $projectData.appResourcesDirectoryPath
            var projectDirectoryPath = $projectData.projectDir;
            var forcePrepare = true;
            var npfInfoPath = path.join(platformsDir, platform, ".pluginfirebaseinfo");
            var nsPrepareInfoPath = path.join(platformsDir, platform, ".nsprepareinfo");
            var project = $projectData['$options']['argv']['env']['project'];
            var copyPlistOpts = { platform, appResourcesDirectoryPath, projectDirectoryPath, buildType, isProdEnv, $logger, project }

            if (fs.existsSync(npfInfoPath)) {
                var npfInfo = undefined;
                try { npfInfo = JSON.parse(fs.readFileSync(npfInfoPath, 'utf8')); }
                catch (e) { $logger.info('nativescript-plugin-firebase: error reading ' + npfInfoPath); }

                // if (npfInfo && npfInfo.hasOwnProperty('buildType') && npfInfo.buildType === buildType) {
                //     $logger.info('nativescript-plugin-firebase: building for same environment, not forcing prepare.');
                //     forcePrepare = false;
                // }
            } else { $logger.info('nativescript-plugin-firebase: 119' + npfInfoPath + ' not found, forcing prepare!'); }

            if (forcePrepare) {
                $logger.info('nativescript-plugin-firebase: running release build or change in environment detected, forcing prepare!');

                if (fs.existsSync(npfInfoPath)) { fs.unlinkSync(npfInfoPath); }
                if (fs.existsSync(nsPrepareInfoPath)) { fs.unlinkSync(nsPrepareInfoPath); }

                if (copyPlist(copyPlistOpts)) { resolve(); } else { reject(); }
                if (copyInfoPlist(copyPlistOpts)) { resolve(); } else { reject(); }
            } else { resolve(); }
        }
    });
};


/*
    Handle preparing of Google Services files for iOS
*/
var copyPlist = function (copyPlistOpts) {
    if (copyPlistOpts.platform === 'android') { return true; }
    else if (copyPlistOpts.platform === 'ios') {
        var sourceGooglePlistProd = path.join(copyPlistOpts.projectDirectoryPath, "configurations", `${copyPlistOpts.project}/ios/GoogleService-Info.plist.prod`);
        var sourceGooglePlistDev = path.join(copyPlistOpts.projectDirectoryPath, "configurations", `${copyPlistOpts.project}/ios/GoogleService-Info.plist.dev`);
        var destinationGooglePlist = path.join(copyPlistOpts.appResourcesDirectoryPath, "iOS", "GoogleService-Info.plist");
        // if we have both dev/prod versions, we copy (or overwrite) GoogleService-Info.plist in destination dir
        if (fs.existsSync(sourceGooglePlistProd) && fs.existsSync(sourceGooglePlistDev)) {
            if (copyPlistOpts.isProdEnv) { // use prod version
                copyPlistOpts.$logger.out("nativescript-plugin-firebase: copy " + sourceGooglePlistProd + " to " + destinationGooglePlist + ".");
                fs.writeFileSync(destinationGooglePlist, fs.readFileSync(sourceGooglePlistProd));
                return true;
            } else { // use dev version
                copyPlistOpts.$logger.out("nativescript-plugin-firebase: copy " + sourceGooglePlistDev + " to " + destinationGooglePlist + ".");
                fs.writeFileSync(destinationGooglePlist, fs.readFileSync(sourceGooglePlistDev));
                return true;
            }
        } else if (!fs.existsSync(destinationGooglePlist)) { // single GoogleService-Info.plist modus but missing
            copyPlistOpts.$logger.warn("nativescript-plugin-firebase: 175" + destinationGooglePlist + " does not exist. Please follow the installation instructions from the documentation");
            return false;
        } else {
            return true; // single GoogleService-Info.plist modus
        }
    } else { return true; }
}


/*
    Handle preparing of Info.plist files for iOS
*/
var copyInfoPlist = function (copyPlistOpts) {
    if (copyPlistOpts.platform === 'android') { return true; }
    else if (copyPlistOpts.platform === 'ios') {
        var sourceInfoPlistProd = path.join(copyPlistOpts.projectDirectoryPath, "configurations", copyPlistOpts.project, "ios", "Info.plist.prod");
        var sourceInfoPlistDev = path.join(copyPlistOpts.projectDirectoryPath, "configurations", copyPlistOpts.project, "ios", "Info.plist.dev");
        var destinationInfoPlist = path.join(copyPlistOpts.appResourcesDirectoryPath, "iOS", "Info.plist");

        // if we have both dev/prod versions, we copy (or overwrite) Info.plist in destination dir
        if (fs.existsSync(sourceInfoPlistProd) && fs.existsSync(sourceInfoPlistDev)) {
            if (copyPlistOpts.isProdEnv) { // use prod version
                copyPlistOpts.$logger.out("nativescript-plugin-firebase: copy " + sourceInfoPlistProd + " to " + destinationInfoPlist + ".");
                fs.writeFileSync(destinationInfoPlist, fs.readFileSync(sourceInfoPlistProd));
                return true;
            } else { // use dev version
                copyPlistOpts.$logger.out("nativescript-plugin-firebase: copy " + sourceInfoPlistDev + " to " + destinationInfoPlist + ".");
                fs.writeFileSync(destinationInfoPlist, fs.readFileSync(sourceInfoPlistDev));
                return true;
            }
        } else if (!fs.existsSync(destinationInfoPlist)) { // single Info.plist modus but missing
            copyPlistOpts.$logger.warn("nativescript-plugin-firebase: 206 " + destinationInfoPlist + " does not exist. Please follow the installation instructions from the documentation");
            return false;
        } else {
            return true; // single Info.plist modus
        }

    } else { return true; }
}