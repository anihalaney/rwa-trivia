
var nativeScriptConfig = require("./../../custom-hooks/nativescript-copy-configuration-files");
module.exports = function ($logger, $projectData, hookArgs) {
    return new Promise(function (resolve, reject) {
        /* Decide whether to prepare for dev or prod environment */

        var isReleaseBuild = (hookArgs.appFilesUpdaterOptions && hookArgs.appFilesUpdaterOptions.release) ? true : false;
        if (isReleaseBuild) {
            var validProdEnvs = ['prod', 'production'];
            var isProdEnv = false; // building with --env.prod or --env.production flag

            if (hookArgs.platformSpecificData.env) {
                Object.keys(hookArgs.platformSpecificData.env).forEach((key) => {
                    if (validProdEnvs.indexOf(key) > -1) { isProdEnv = true; }
                });
            }

            var buildType = isProdEnv ? 'production' : 'development';

            /* Handle preparing of Android xml files */

            if (hookArgs.platform.toLowerCase() === 'android') {

                nativeScriptConfig.copyAndroidConfig($projectData.appResourcesDirectoryPath,  // appResourcesDirPath
                    $projectData.projectDir, // projectDir
                    hookArgs.platformSpecificData.env.project, // projectName
                    buildType, //buildType
                    $logger);
                resolve();

            } else {
                nativeScriptConfig.copyIosConfig($projectData.appResourcesDirectoryPath,  // appResourcesDirPath
                    $projectData.projectDir, // projectDir
                    hookArgs.platformSpecificData.env.project, // projectName
                    buildType, //buildType
                    $logger,
                    hookArgs.platform.toLowerCase(),
                    $projectData.platformsDir, // platformsDir
                    isProdEnv);
                resolve();
            }

        } else {
            resolve();
        }
    });
};
