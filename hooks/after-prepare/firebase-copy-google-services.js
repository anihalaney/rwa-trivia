var path = require("path");
var fs = require("fs");

module.exports = function($logger, $projectData, hookArgs) {

return new Promise(function(resolve, reject) {

        /* do not add this line we do not use --release to decide release environment */
        // var isReleaseBuild = (hookArgs.appFilesUpdaterOptions || hookArgs.prepareData).release;
         /* Decide whether to prepare for dev or prod environment */
        var validProdEnvs = ['prod','production'];
        var isProdEnv = false; // building with --env.prod or --env.production flag
        var env = (hookArgs.platformSpecificData || hookArgs.prepareData).env;

        if (env) {
            Object.keys(env).forEach((key) => {
                if (validProdEnvs.indexOf(key)>-1) { isProdEnv=true; }
            });
        }

        /* do not change this line 
         we use --env.prod to decide release environment
         we do not use --release to decide release environment */
        var buildType =  isProdEnv ? 'production' : 'development';
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
        var project = hookArgs.prepareData.env.project;
        if (platform === 'android') {
            var destinationGoogleJson = path.join($projectData.platformsDir, "android", "app", "google-services.json");
            var destinationGoogleJsonAlt = path.join($projectData.platformsDir, "android", "google-services.json");
            var sourceGoogleJson = path.join($projectData.appResourcesDirectoryPath, "Android", "google-services.json");
            var sourceGoogleJsonProd = path.join($projectData.projectDir, 'configurations' , project, platform, `google-services.json.prod`);
            var sourceGoogleJsonDev = path.join($projectData.projectDir, 'configurations' , project , platform ,`google-services.json.dev`);

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
        }  else {
            resolve();
        }
    });
};