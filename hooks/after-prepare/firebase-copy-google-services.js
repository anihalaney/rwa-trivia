
var path = require("path");
var fs = require("fs");

module.exports = function($logger, $projectData, hookArgs) {

    return new Promise(function(resolve, reject) {
        if (hookArgs.platform.toLowerCase() === 'android') {
            var sourceGoogleJson = path.join($projectData.appResourcesDirectoryPath, "Android", "google-services.json");
            var destinationGoogleJson = path.join($projectData.platformsDir, "android", "app", "google-services.json");
            var destinationGoogleJsonAlt = path.join($projectData.platformsDir, "android", "google-services.json");
            if (fs.existsSync(sourceGoogleJson) && fs.existsSync(path.dirname(destinationGoogleJson))) {
                $logger.out("Copy " + sourceGoogleJson + " to " + destinationGoogleJson + ".");
                fs.writeFileSync(destinationGoogleJson, fs.readFileSync(sourceGoogleJson));
                resolve();
            } else if (fs.existsSync(sourceGoogleJson) && fs.existsSync(path.dirname(destinationGoogleJsonAlt))) {
                // NativeScript < 4 doesn't have the 'app' folder
                $logger.out("Copy " + sourceGoogleJson + " to " + destinationGoogleJsonAlt + ".");
                fs.writeFileSync(destinationGoogleJsonAlt, fs.readFileSync(sourceGoogleJson));
                resolve();
            } else {
                $logger.warn("Unable to copy google-services.json.");
                reject();
            }
        } else if (hookArgs.platform.toLowerCase() === 'ios') {
            var sourceGooglePlist = path.join($projectData.appResourcesDirectoryPath, "iOS", "GoogleService-Info.plist");
            if (!fs.existsSync(sourceGooglePlist)) {
                $logger.warn(sourceGooglePlist + " does not exist. Please follow the installation instructions from the documentation");
                return reject();
            } else {
                resolve();
            }
        } else {
            resolve();
        }
    });
};
