const fs = require('fs-extra');
const path = require('path');
const xcode = require('xcode');

const pattern1 = /\n\s*\/\/Crashlytics 1 BEGIN[\s\S]*\/\/Crashlytics 1 END.*\n/m;
const pattern2 = /\n\s*\/\/Crashlytics 2 BEGIN[\s\S]*\/\/Crashlytics 2 END.*\n/m;
const pattern3 = /\n\s*\/\/Crashlytics 3 BEGIN[\s\S]*\/\/Crashlytics 3 END.*\n/m;

const string1 = `
//Crashlytics 1 BEGIN
#else
#import <Crashlytics/CLSLogging.h>
#endif
//Crashlytics 1 END
`;

const string2 = `
//Crashlytics 2 BEGIN
#if DEBUG
#else
static int redirect_cls(const char *prefix, const char *buffer, int size) {
  CLSLog(@"%s: %.*s", prefix, size, buffer);
  return size;
}

static int stderr_redirect(void *inFD, const char *buffer, int size) {
  return redirect_cls("stderr", buffer, size);
}

static int stdout_redirect(void *inFD, const char *buffer, int size) {
  return redirect_cls("stdout", buffer, size);
}
#endif
//Crashlytics 2 END
`;

const string3 = `
//Crashlytics 3 BEGIN
#if DEBUG
#else
  // Per https://docs.fabric.io/apple/crashlytics/enhanced-reports.html#custom-logs :
  // Crashlytics ensures that all log entries are recorded, even if the very next line of code crashes.
  // This means that logging must incur some IO. Be careful when logging in performance-critical areas.

  // As per the note above, enabling this can affect performance if too much logging is present.
  // stdout->_write = stdout_redirect;

  // stderr usually only occurs during critical failures;
  // so it is usually essential to identifying crashes, especially in JS
  stderr->_write = stderr_redirect;
#endif
//Crashlytics 3 END
`;

module.exports = function($logger, $projectData, hookArgs) {
  const platformFromHookArgs = hookArgs && (hookArgs.platform || (hookArgs.prepareData && hookArgs.prepareData.platform));
  const platform = (platformFromHookArgs  || '').toLowerCase();
  return new Promise(function(resolve, reject) {
    const isNativeProjectPrepared = hookArgs.prepareData ? (!hookArgs.prepareData.nativePrepare || !hookArgs.prepareData.nativePrepare.skipNativePrepare) : (!hookArgs.nativePrepare || !hookArgs.nativePrepare.skipNativePrepare);
    if (isNativeProjectPrepared) {
      try {
        if (platform === 'ios') {
          const sanitizedAppName = path.basename($projectData.projectDir).split('').filter((c) => /[a-zA-Z0-9]/.test(c)).join('');

          // write buildscript for dSYM upload
          const xcodeProjectPath = path.join($projectData.platformsDir, 'ios', sanitizedAppName + '.xcodeproj', 'project.pbxproj');
          $logger.trace('Using Xcode project', xcodeProjectPath);
          if (fs.existsSync(xcodeProjectPath)) {
            var xcodeProject = xcode.project(xcodeProjectPath);
            xcodeProject.parseSync();

            // Xcode 10 requires 'inputPaths' set, see https://firebase.google.com/docs/crashlytics/get-started
            var options = {
              shellPath: '/bin/sh', shellScript: '"${PODS_ROOT}/Fabric/run"',
              inputPaths: ['"$(SRCROOT)/$(BUILT_PRODUCTS_DIR)/$(INFOPLIST_PATH)"']
            };

            xcodeProject.addBuildPhase(
              [], 'PBXShellScriptBuildPhase', 'Configure Crashlytics', undefined, options
            ).buildPhase;
            fs.writeFileSync(xcodeProjectPath, xcodeProject.writeSync());
            $logger.trace('Xcode project written');
          } else {
            $logger.error(xcodeProjectPath + ' is missing.');
            reject();
            return;
          }

          // Logging from stdout/stderr
          $logger.info('Add iOS crash logging');
          const mainmPath = path.join($projectData.platformsDir, 'ios', 'internal', 'main.m');
          if (fs.existsSync(mainmPath)) {
            let mainmContent = fs.readFileSync(mainmPath).toString();
            // string1
            mainmContent = pattern1.test(mainmContent)
              ? mainmContent.replace(pattern1, string1)
              : mainmContent.replace(/(\n#endif\n)/, string1);
            // string2
            mainmContent = pattern2.test(mainmContent)
              ? mainmContent.replace(pattern2, string2)
              : mainmContent.replace(/(\nint main.*)/, string2 + '$1');
            // string3
            mainmContent = pattern3.test(mainmContent)
              ? mainmContent.replace(pattern3, string3)
              : mainmContent.replace(/(int main.*\n)/, '$1' + string3 + '\n');
            fs.writeFileSync(mainmPath, mainmContent);
          } else {
            $logger.error(mainmPath + ' is missing.');
            reject();
            return;
          }

          resolve();
        } else {
          resolve();
        }
      } catch (e) {
        $logger.error('Unknown error during prepare Crashlytics', e);
        reject();
      }
    } else {
      $logger.trace("Native project not prepared.");
      resolve();
    }
  });
};
