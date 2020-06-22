var nativeScriptConfig = require("./../../custom-hooks/nativescript-copy-configuration-files");
module.exports = function ($logger, $projectData, hookArgs) {
  
    return new Promise(function (resolve, reject) {
            /* do not add this line we do not use --release to decide release environment */
            // var isReleaseBuild = (hookArgs.appFilesUpdaterOptions && hookArgs.appFilesUpdaterOptions.release) ? true : false;
             /* Decide whether to prepare for dev or prod environment */

            var validProdEnvs = ['prod', 'production'];
            var isProdEnv = false; // building with --env.prod or --env.production flag
            var env = (hookArgs.platformSpecificData || hookArgs.prepareData).env;
            if (env) {
                Object.keys(env).forEach((key) => {
                    if (validProdEnvs.indexOf(key) > -1) { isProdEnv = true; }
                });
            }

            var buildType = isProdEnv ? 'production' : 'development';

            /* Handle preparing of Android xml files */

            if (hookArgs.prepareData.platform.toLowerCase() === 'android') {

                nativeScriptConfig.copyAndroidConfig($projectData.appResourcesDirectoryPath,  // appResourcesDirPath
                    $projectData.projectDir, // projectDir
                    hookArgs.prepareData.env.project, // projectName
                    buildType, //buildType
                    $logger);
                resolve();

            } else {
                nativeScriptConfig.copyIosConfig($projectData.appResourcesDirectoryPath,  // appResourcesDirPath
                    $projectData.projectDir, // projectDir
                    hookArgs.prepareData.env.project, // projectName
                    buildType, //buildType
                    $logger,
                    hookArgs.prepareData.platform.toLowerCase(),
                    $projectData.platformsDir, // platformsDir
                    isProdEnv);
                resolve();
            }

       
    });
};