
var path = require("path");
var fs = require("fs");

module.exports = function($logger, $projectData, hookArgs) {

return new Promise(function(resolve, reject) {

        /* Decide whether to prepare for dev or prod environment */
        var isReleaseBuild = (hookArgs.appFilesUpdaterOptions || hookArgs.prepareData).release;
        var validProdEnvs = ['prod','production'];
        var isProdEnv = false; // building with --env.prod or --env.production flag
        var env = (hookArgs.platformSpecificData || hookArgs.prepareData).env;

        if (env) {
            Object.keys(env).forEach((key) => {
                if (validProdEnvs.indexOf(key)>-1) { isProdEnv=true; }
            });
        }

        var buildType = isReleaseBuild || isProdEnv ? 'production' : 'development';
        const platformFromHookArgs = hookArgs && (hookArgs.platform || (hookArgs.prepareData && hookArgs.prepareData.platform));
        const platform = (platformFromHookArgs  || '').toLowerCase();

        /* Create info file in platforms dir so we can detect changes in environment and force prepare if needed */

        var npfInfoPath = path.join($projectData.platformsDir, platform, ".pluginfirebaseinfo");
        var npfInfo = {
            buildType: buildType,
        };

        try { fs.writeFileSync(npfInfoPath, JSON.stringify(npfInfo)); }
        catch (err) {
            $logger.info('nativescript-plugin-firebase: unable to create '+npfInfoPath+', prepare will be forced next time!');
        }


        /* Handle preparing of Google Services files */

        if (platform === 'android') {
            var destinationGoogleJson = path.join($projectData.platformsDir, "android", "app", "google-services.json");
            var destinationGoogleJsonAlt = path.join($projectData.platformsDir, "android", "google-services.json");
            var sourceGoogleJson = path.join($projectData.appResourcesDirectoryPath, "Android", "google-services.json");
            var sourceGoogleJsonProd = path.join($projectData.appResourcesDirectoryPath, "Android", "google-services.json.prod");
            var sourceGoogleJsonDev = path.join($projectData.appResourcesDirectoryPath, "Android", "google-services.json.dev");

            // ensure we have both dev/prod versions so we never overwrite singlular google-services.json
            if (fs.existsSync(sourceGoogleJsonProd) && fs.existsSync(sourceGoogleJsonDev)) {
                if (buildType==='production') { sourceGoogleJson = sourceGoogleJsonProd; } // use prod version
                else { sourceGoogleJson = sourceGoogleJsonDev; } // use dev version
            }

            // copy correct version to destination
            if (fs.existsSync(sourceGoogleJson) && fs.existsSync(path.dirname(destinationGoogleJson))) {
                $logger.info("Copy " + sourceGoogleJson + " to " + destinationGoogleJson + ".");
                fs.writeFileSync(destinationGoogleJson, fs.readFileSync(sourceGoogleJson));
                resolve();
            } else if (fs.existsSync(sourceGoogleJson) && fs.existsSync(path.dirname(destinationGoogleJsonAlt))) {
                // NativeScript < 4 doesn't have the 'app' folder
                $logger.info("Copy " + sourceGoogleJson + " to " + destinationGoogleJsonAlt + ".");
                fs.writeFileSync(destinationGoogleJsonAlt, fs.readFileSync(sourceGoogleJson));
                resolve();
            } else {
                $logger.warn("Unable to copy google-services.json.");
                reject();
            }
        } else if (platform === 'ios') {
            // we have copied our GoogleService-Info.plist during before-checkForChanges hook, here we delete it to avoid changes in git
            var destinationGooglePlist = path.join($projectData.appResourcesDirectoryPath, "iOS", "GoogleService-Info.plist");
            var sourceGooglePlistProd = path.join($projectData.appResourcesDirectoryPath, "iOS", "GoogleService-Info.plist.prod");
            var sourceGooglePlistDev = path.join($projectData.appResourcesDirectoryPath, "iOS", "GoogleService-Info.plist.dev");

            // if we have both dev/prod versions, let's remove GoogleService-Info.plist in destination dir
            if (fs.existsSync(sourceGooglePlistProd) && fs.existsSync(sourceGooglePlistDev)) {
                if (fs.existsSync(destinationGooglePlist)) { fs.unlinkSync(destinationGooglePlist); }
                resolve();
            } else { // single GoogleService-Info.plist modus
                resolve();
            }
        } else {
            resolve();
        }
    });
};
