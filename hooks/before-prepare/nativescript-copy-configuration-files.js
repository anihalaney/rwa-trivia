var path = require("path");
var fs = require("fs");

module.exports = function ($logger, $projectData, hookArgs) {

    return new Promise(function (resolve, reject) {
        /* Decide whether to prepare for dev or prod environment */
        
        var isReleaseBuild = (hookArgs.appFilesUpdaterOptions && hookArgs.appFilesUpdaterOptions.release) ? true : false;
        if (isReleaseBuild) {
            console.log(hookArgs);
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
    
                // Replace facebooklogin.xml files with dev and prod environment
    
                var destinationFacebookLoginXml = path.join($projectData.appResourcesDirectoryPath, "Android", "values", "facebooklogin.xml");
                var destinationFacebookLoginXmlAlt = path.join($projectData.appResourcesDirectoryPath, "Android", "values", "facebooklogin.xml");
                var sourceFacebookLoginXml = path.join($projectData.projectDir, "configurations", "android", "facebooklogin.xml");
                var sourceFacebookLoginXmlProd = path.join($projectData.projectDir, "configurations",hookArgs.platformSpecificData.env.project, "android", "facebooklogin.prod.xml");
                var sourceFacebookLoginXmlDev = path.join($projectData.projectDir, "configurations",hookArgs.platformSpecificData.env.project, "android", "facebooklogin.dev.xml");
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
                var sourceStringsXmlProd = path.join($projectData.projectDir, "configurations",hookArgs.platformSpecificData.env.project, "android", "strings.prod.xml");
                var sourceStringsXmlDev = path.join($projectData.projectDir, "configurations",hookArgs.platformSpecificData.env.project, "android", "strings.dev.xml");
    
       
    
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
    
            }  else {
                resolve();
            }
    
        } else {
            resolve();
        }
    });
};