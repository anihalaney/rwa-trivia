
var nativeScriptConfig = require("./../../custom-hooks/nativescript-copy-configuration-files");
module.exports = function ($logger, $projectData, hookArgs) {
    return new Promise(function (resolve, reject) {

        /* Decide whether to prepare for dev or prod environment */
        var env = (hookArgs.platformSpecificData || hookArgs.prepareData).env;
        //   var isReleaseBuild = (hookArgs.appFilesUpdaterOptions && hookArgs.appFilesUpdaterOptions.release) ? true : false;

        const platformFromHookArgs = hookArgs && (hookArgs.platform || (hookArgs.prepareData && hookArgs.prepareData.platform));
        const platform = (platformFromHookArgs  || '').toLowerCase();
        var validProdEnvs = ['prod', 'production'];
        var isProdEnv = false; // building with --env.prod or --env.production flag

        if (env) {
            Object.keys(env).forEach((key) => {
                if (validProdEnvs.indexOf(key) > -1) { isProdEnv = true; }
            });
        }

        var buildType = isProdEnv ? 'production' : 'development';

        /* Handle preparing of Android xml files */

        if (platform === 'android') {
            nativeScriptConfig.copyAndroidConfig($projectData.appResourcesDirectoryPath,  // appResourcesDirPath
                $projectData.projectDir, // projectDir
                env.project, // projectName
                buildType, //buildType
                $logger);
            resolve();
        } else {

            nativeScriptConfig.copyIosConfig($projectData.appResourcesDirectoryPath,  // appResourcesDirPath
                $projectData.projectDir, // projectDir
                env.project, // projectName
                buildType, //buildType
                $logger,
                platform,
                $projectData.platformsDir, // platformsDir
                isProdEnv);
            resolve();

        }
    });
};
