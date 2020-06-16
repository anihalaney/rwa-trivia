var path = require("path");
var fs = require("fs");
module.exports = {

    copyAndroidConfig: function (appResourcesDirPath,
        projectDir,
        projectName,
        buildType,
        logger) {
        copyFacebookResourceFileOpt = {
            appResourcesDirPath, projectDir, projectName, buildType, logger, originalFileName: "facebooklogin.xml", prodFileName: "facebooklogin.prod.xml", devFileName: "facebooklogin.dev.xml"
        }
        // Replace facebooklogin.xml files with dev and prod environment
        copyResourceFile(copyFacebookResourceFileOpt);

        copyStringResourceFileOpt = {
            appResourcesDirPath, projectDir, projectName, buildType, logger, originalFileName: "strings.xml", prodFileName: "strings.prod.xml", devFileName: "strings.dev.xml"
        }

        // Replace strings.xml files with dev and prod environment
        copyResourceFile(copyStringResourceFileOpt)
        // Replace facebooklogin.xml files with dev and prod environment
        // var destinationFacebookLoginXml = path.join(appResourcesDirPath, "Android", "values", "facebooklogin.xml");
        // var destinationFacebookLoginXmlAlt = path.join(appResourcesDirPath, "Android", "values", "facebooklogin.xml");
        // var sourceFacebookLoginXml = path.join(projectDir, "configurations", "android", "facebooklogin.xml");
        // var sourceFacebookLoginXmlProd = path.join(projectDir, "configurations", projectName, "android", "facebooklogin.prod.xml");
        // var sourceFacebookLoginXmlDev = path.join(projectDir, "configurations", projectName, "android", "facebooklogin.dev.xml");

        // // ensure we have both dev/prod versions so we never overwrite singular facebooklogin.xml
        // if (fs.existsSync(sourceFacebookLoginXmlProd) && fs.existsSync(sourceFacebookLoginXmlDev)) {
        //     if (buildType === 'production') { sourceFacebookLoginXml = sourceFacebookLoginXmlProd; } // use prod version
        //     else { sourceFacebookLoginXml = sourceFacebookLoginXmlDev; } // use dev version
        // }

        // // copy correct version to destination
        // if (fs.existsSync(sourceFacebookLoginXml) && fs.existsSync(path.dirname(destinationFacebookLoginXml))) {
        //     logger.out("Copy " + sourceFacebookLoginXml + " to " + destinationFacebookLoginXml + ".");
        //     fs.writeFileSync(destinationFacebookLoginXml, fs.readFileSync(sourceFacebookLoginXml));
        //     facebookFileExist = true;
        // } else if (fs.existsSync(sourceFacebookLoginXml) && fs.existsSync(path.dirname(destinationFacebookLoginXmlAlt))) {
        //     // NativeScript < 4 doesn't have the 'app' folder
        //     logger.out("Copy " + sourceFacebookLoginXml + " to " + destinationFacebookLoginXmlAlt + ".");
        //     fs.writeFileSync(destinationFacebookLoginXmlAlt, fs.readFileSync(sourceFacebookLoginXml));
        //     facebookFileExist = true;
        // } else {
        //     logger.warn("Unable to copy facebooklogin.xml.");
        //     facebookFileExist = false;
        // }

        // Replace strings.xml files with dev and prod environment
        // var destinationStringsXml = path.join(appResourcesDirPath, "Android", "values", "strings.xml");
        // var destinationStringsXmlAlt = path.join(appResourcesDirPath, "Android", "values", "strings.xml");
        // var sourceStringsXml = path.join(projectDir, "configurations", "android", "strings.xml");
        // var sourceStringsXmlProd = path.join(projectDir, "configurations", projectName, "android", "strings.prod.xml");
        // var sourceStringsXmlDev = path.join(projectDir, "configurations", projectName, "android", "strings.dev.xml");

        // // ensure we have both dev/prod versions so we never overwrite singular strings.xml
        // if (fs.existsSync(sourceStringsXmlProd) && fs.existsSync(sourceStringsXmlDev)) {
        //     if (buildType === 'production') { sourceStringsXml = sourceStringsXmlProd; } // use prod version
        //     else { sourceStringsXml = sourceStringsXmlDev; } // use dev version
        // }

        // // copy correct version to destination
        // if (fs.existsSync(sourceStringsXml) && fs.existsSync(path.dirname(destinationStringsXml))) {
        //     logger.out("Copy " + sourceStringsXml + " to " + destinationStringsXml + ".");
        //     fs.writeFileSync(destinationStringsXml, fs.readFileSync(sourceStringsXml));
        //     stringsFileExist = true;
        // } else if (fs.existsSync(sourceStringsXml) && fs.existsSync(path.dirname(destinationStringsXmlAlt))) {
        //     // NativeScript < 4 doesn't have the 'app' folder
        //     logger.out("Copy " + sourceStringsXml + " to " + destinationStringsXmlAlt + ".");
        //     fs.writeFileSync(destinationStringsXmlAlt, fs.readFileSync(sourceStringsXml));
        //     stringsFileExist = true;
        // } else {
        //     logger.warn("Unable to copy strings.xml.");
        //     stringsFileExist = false;
        // }
    },

    copyIosConfig(appResourcesDirPath, //$-projectData.appResourcesDirectoryPath,  // appResourcesDirPath
        projectDir, //$-projectData.projectDir, // 
        projectName, //hookArgs-.platformSpecificData.env.project, // projectName
        buildType,
        logger,
        platform,
        platformsDir,
        isProdEnv) {
            
        var appResourcesDirectoryPath = appResourcesDirPath
        var projectDirectoryPath = projectDir;
        var forcePrepare = true;
        var npfInfoPath = path.join(platformsDir, platform, ".pluginfirebaseinfo");
        var nsPrepareInfoPath = path.join(platformsDir, platform, ".nsprepareinfo");
        var project = projectName;
        var copyPlistOpts = { platform, appResourcesDirectoryPath, projectDirectoryPath, buildType, isProdEnv, logger, project }

        if (fs.existsSync(npfInfoPath)) {

            try { npfInfo = JSON.parse(fs.readFileSync(npfInfoPath, 'utf8')); }
            catch (e) { logger.info('nativescript-plugin-firebase: error reading ' + npfInfoPath); }

        } else { logger.info('nativescript-plugin-firebase: 119' + npfInfoPath + ' not found, forcing prepare!'); }
        logger.info('nativescript-plugin-firebase: running release build or change in environment detected, forcing prepare!');

        if (fs.existsSync(npfInfoPath)) { fs.unlinkSync(npfInfoPath); }
        if (fs.existsSync(nsPrepareInfoPath)) { fs.unlinkSync(nsPrepareInfoPath); }
        copyPlist(copyPlistOpts);
        copyInfoPlist(copyPlistOpts);
        return true;
    }
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
                copyPlistOpts.logger.info("nativescript-plugin-firebase: copy " + sourceGooglePlistProd + " to " + destinationGooglePlist + ".");
                fs.writeFileSync(destinationGooglePlist, fs.readFileSync(sourceGooglePlistProd));
                return true;
            } else { // use dev version
                copyPlistOpts.logger.info("nativescript-plugin-firebase: copy " + sourceGooglePlistDev + " to " + destinationGooglePlist + ".");
                fs.writeFileSync(destinationGooglePlist, fs.readFileSync(sourceGooglePlistDev));
                return true;
            }
        } else if (!fs.existsSync(destinationGooglePlist)) { // single GoogleService-Info.plist modus but missing
            copyPlistOpts.logger.warn("nativescript-plugin-firebase: 175" + destinationGooglePlist + " does not exist. Please follow the installation instructions from the documentation");
            return false;
        } else {
            return true; // single GoogleService-Info.plist modus
        }
    } else { return true; }
};


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
                copyPlistOpts.logger.info("nativescript-plugin-firebase: copy " + sourceInfoPlistProd + " to " + destinationInfoPlist + ".");
                fs.writeFileSync(destinationInfoPlist, fs.readFileSync(sourceInfoPlistProd));
                return true;
            } else { // use dev version
                copyPlistOpts.logger.info("nativescript-plugin-firebase: copy " + sourceInfoPlistDev + " to " + destinationInfoPlist + ".");
                fs.writeFileSync(destinationInfoPlist, fs.readFileSync(sourceInfoPlistDev));
                return true;
            }
        } else if (!fs.existsSync(destinationInfoPlist)) { // single Info.plist modus but missing
            copyPlistOpts.logger.warn("nativescript-plugin-firebase: 206 " + destinationInfoPlist + " does not exist. Please follow the installation instructions from the documentation");
            return false;
        } else {
            return true; // single Info.plist modus
        }

    } else { return true; }
}


var copyResourceFile = function (options) {

    // Replace FILENAME.xml files with dev and prod environment
    var destinationXml = path.join(options.appResourcesDirPath,  "Android", "src", "main" , "res" , "values", options.originalFileName);
    var destinationXmlAlt = path.join(options.appResourcesDirPath,  "Android", "src", "main" , "res" , "values", options.originalFileName);
    var sourceXml = path.join(options.projectDir, "configurations", "android", options.originalFileName);
    var sourceXmlProd = path.join(options.projectDir, "configurations", options.projectName, "android", options.prodFileName);
    var sourceXmlDev = path.join(options.projectDir, "configurations", options.projectName, "android", options.devFileName);

    // ensure we have both dev/prod versions so we never overwrite singular facebooklogin.xml
    if (fs.existsSync(sourceXmlProd) && fs.existsSync(sourceXmlDev)) {
        if (options.buildType === 'production') { sourceXml = sourceXmlProd; } // use prod version
        else { sourceXml = sourceXmlDev; } // use dev version
    }

    // copy correct version to destination
    if (fs.existsSync(sourceXml) && fs.existsSync(path.dirname(destinationXml))) {
        options.logger.info("Copy " + sourceXml + " to " + destinationXml + ".");
        fs.writeFileSync(destinationXml, fs.readFileSync(sourceXml));
        facebookFileExist = true;
    } else if (fs.existsSync(sourceXml) && fs.existsSync(path.dirname(destinationXmlAlt))) {
        // NativeScript < 4 doesn't have the 'app' folder
        options.logger.info("Copy " + sourceXml + " to " + destinationXmlAlt + ".");
        fs.writeFileSync(destinationXmlAlt, fs.readFileSync(sourceXml));
        facebookFileExist = true;
    } else {
        options.logger.warn(`Unable to copy ${options.originalFileName}.`);
        facebookFileExist = false;
    }
}