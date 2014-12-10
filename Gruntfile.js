module.exports = function(grunt) {
  "use strict";
  // Project configuration.
  var jsFiles = ["./Gruntfile.js", "src/**/*.js"];
  var jsbeautifierconfigObject = grunt.file.readJSON("jsbeautifier.json");
  var sourceJsFiles = [
    "src/headerNotice.md",
    "src/choona.Klass.js",
    "src/choona.Base.js",
    "src/choona.Settings.js",
    "src/choona.Util.js",
    "src/choona.EventBus.js",
    "src/choona.Model.js",
    "src/choona.View.js",
    "src/choona.Router.js",
    "src/choona.AMD.js"
  ];
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    uglify: {
      build: {
        "src": "dist/choona.js",
        "dest": "dist/choona.min.js"
      }
    },
    clean: {
      all: {
        src: ["dist/*"]
      }
    },
    docco: {
      debug: {
        src: jsFiles,
        options: {
          output: "docs/"
        }
      }
    },
    watch: {
      js: {
        files: sourceJsFiles,
        tasks: ["build"]
      },
      js1: {
        files: ["dist/choona.js"],
        options: {
          livereload: true
        }
      }
    },
    concat: {
      options: {
        separator: ";"
      },
      js: {
        src: sourceJsFiles,
        dest: "dist/choona.js"
      }
    },
    jshint: {
      all: jsFiles,
      options: {
        jshintrc: ".jshintrc",
        jshintignore: ".jshintignore"
      }
    },
    jsbeautifier: {
      files: jsFiles,
      options: jsbeautifierconfigObject
    }
  });

  grunt.loadNpmTasks("grunt-docco");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-jsbeautifier");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.registerTask("build", ["check", "clean", "concat", "uglify:build"]);
  grunt.registerTask("check", ["jsbeautifier", "jshint"]);
  grunt.registerTask("default", ["build"]);

};
