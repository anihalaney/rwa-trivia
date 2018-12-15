
var path = require("path");
var fs = require("fs");

module.exports = function ($logger, $projectData, hookArgs) {

    return new Promise(function (resolve, reject) {

        /* Decide whether to prepare for dev or prod environment */

        var isReleaseBuild = (hookArgs.appFilesUpdaterOptions && hookArgs.appFilesUpdaterOptions.release) ? true : false;
        var validProdEnvs = ['prod', 'production'];
        var isProdEnv = false; // building with --env.prod or --env.production flag

        if (hookArgs.platformSpecificData.env) {
            Object.keys(hookArgs.platformSpecificData.env).forEach((key) => {
                if (validProdEnvs.indexOf(key) > -1) { isProdEnv = true; }
            });
        }

        var buildType = isReleaseBuild || isProdEnv ? 'production' : 'development';


        /* Handle preparing of Android xml files */

        if (hookArgs.platform.toLowerCase() === 'android') {

            // Replace facebooklogin.xml files with dev and prod environment

            var destinationFacebookLoginXml = path.join($projectData.appResourcesDirectoryPath, "Android", "values", "facebooklogin.xml");
            var destinationFacebookLoginXmlAlt = path.join($projectData.appResourcesDirectoryPath, "Android", "values", "facebooklogin.xml");
            var sourceFacebookLoginXml = path.join($projectData.projectDir, "configurations", "android", "facebooklogin.xml");
            var sourceFacebookLoginXmlProd = path.join($projectData.projectDir, "configurations", "android", "facebooklogin.prod.xml");
            var sourceFacebookLoginXmlDev = path.join($projectData.projectDir, "configurations", "android", "facebooklogin.dev.xml");

            // ensure we have both dev/prod versions so we never overwrite singlular facebooklogin.xml
            if (fs.existsSync(sourceFacebookLoginXmlProd) && fs.existsSync(sourceFacebookLoginXmlDev)) {
                if (buildType === 'production') { sourceFacebookLoginXml = sourceFacebookLoginXmlProd; } // use prod version
                else { sourceFacebookLoginXml = sourceFacebookLoginXmlDev; } // use dev version
            }

            // copy correct version to destination
            if (fs.existsSync(sourceFacebookLoginXml) && fs.existsSync(path.dirname(destinationFacebookLoginXml))) {
                $logger.out("Copy " + sourceFacebookLoginXml + " to " + destinationFacebookLoginXml + ".");
                fs.writeFileSync(destinationFacebookLoginXml, fs.readFileSync(sourceFacebookLoginXml));
                resolve();
            } else if (fs.existsSync(sourceFacebookLoginXml) && fs.existsSync(path.dirname(destinationFacebookLoginXmlAlt))) {
                // NativeScript < 4 doesn't have the 'app' folder
                $logger.out("Copy " + sourceFacebookLoginXml + " to " + destinationFacebookLoginXmlAlt + ".");
                fs.writeFileSync(destinationFacebookLoginXmlAlt, fs.readFileSync(sourceFacebookLoginXml));
                resolve();
            } else {
                $logger.warn("Unable to copy facebooklogin.xml.");
                reject();
            }
        } else if (hookArgs.platform.toLowerCase() === 'ios') {  /* Handle preparing of Ios xml files */
            // we have copied our Info.plist during before-checkForChanges hook, here we delete it to avoid changes in git
            var destinationInfoPlist = path.join($projectData.appResourcesDirectoryPath, "iOS", "Info.plist");
            var sourceInfoPlistProd = path.join($projectData.projectDir, "configurations", "ios", "Info.plist.prod");
            var sourceInfoPlistDev = path.join($projectData.projectDir, "configurations", "ios", "Info.plist.dev");

            // ensure we have both dev/prod versions so we never overwrite singlular Info.plist
            if (fs.existsSync(sourceInfoPlistProd) && fs.existsSync(sourceInfoPlistDev)) {
                if (buildType === 'production') { sourceInfoPlist = sourceInfoPlistProd; } // use prod version
                else { sourceInfoPlist = sourceInfoPlistDev; } // use dev version
            }

            // copy correct version to destination
            if (fs.existsSync(sourceInfoPlist) && fs.existsSync(path.dirname(destinationInfoPlist))) {
                $logger.out("Copy " + sourceInfoPlist + " to " + destinationInfoPlist + ".");
                fs.writeFileSync(destinationInfoPlist, fs.readFileSync(sourceInfoPlist));
                resolve();
            } else {
                $logger.warn("Unable to copy Info.plist.");
                reject();
            }
        } else {
            resolve();
        }
    });
};
