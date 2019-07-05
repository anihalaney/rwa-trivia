const { join, parse } = require("path");
const nsWebpack = require("nativescript-dev-webpack");
const fs = require("fs");

module.exports.getResolverExtended = function (platforms, project) {
    let path = nsWebpack.getResolver(platforms);
    return function (path) {
      const {
        dir,
        name,
        ext
      } = parse(path);
      let newDir = dir;
      for (const platform of platforms) {
        if (dir.endsWith('environments') && dir.search('node_modules') < 0 ) {
          newDir = toSystemPath(join(dir, project));
        }
  
        const platformFileName = `${name}.${platform}${ext}`;
        const platformPath = toSystemPath(join(newDir, platformFileName));
        try {
          if (fs.statSync(platformPath)) {
            return platformPath;
          }
        } catch (_e) {
          // continue checking the other platforms
        }
  
      }
      return path;
    }
  }
  // Convert paths from \c\some\path to c:\some\path
  function toSystemPath(path) {
    if (!process.platform.startsWith("win32")) {
      return path;
    }
    const drive = path.match(/^\\(\w)\\(.*)$/);
    return path;
  }
  //# sourceMappingURL=resolver.js.map