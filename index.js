var fs = require('fs'),
    path = require('path'),
    sass = require('node-sass');

/**
  Same as `render()` but with an extra `outFile` property in `options` and writes
  the CSS and sourceMap (if requested) to the filesystem.
 */
exports.renderFile = function(options) {
  var newOptions = {};
  for (var i in options) {
    if (options.hasOwnProperty(i)) {
      newOptions[i] = options[i];
    }
  }
  newOptions.success = function(css, sourceMap) {
    fs.writeFile(options.outFile, css, function(err) {
      if (err) {
        return error(err);
      }
      if (options.sourceMap) {
        var sourceMapFile = options.sourceMap;
        if (sourceMapFile === true) {
          sourceMapFile = options.file + '.map';
        }
        var dir = path.dirname(options.outFile);
        sourceMapFile = path.resolve(dir, sourceMapFile);
        fs.writeFile(sourceMapFile, sourceMap, function(err) {
          if (err) {
            return error(err);
          }
          success(css, sourceMap);
        });
      }
      else {
        success(css, sourceMap);
      }
    });
  };
  function error(err) {
    if (options.error) {
      options.error(err);
    }
  }
  function success(css, sourceMap) {
    if (options.success) {
      options.success(css, sourceMap);
    }
  }
  sass.render(newOptions);
};
