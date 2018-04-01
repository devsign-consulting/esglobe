"use strict";

var gulp = require("gulp");
gulp = require('gulp-help')(gulp, {
  hideDepsMessage: true
});

var path = require('path');
var glob = require("glob");
var Promise = require("bluebird");
var less = require('gulp-less');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var gulpCopy = require('gulp-copy');
var runSequence = require('run-sequence').use(gulp);
var argv = require('yargs').argv;
var _ = require('lodash');
var fs = require("fs");

var env = "test";

// Paths
var paths = {
  src: {
    package: 'package.json',
    js: {
      vendor: [
        'node_modules/jquery/dist/jquery.js',
        'node_modules/bootstrap/dist/js/bootstrap.js',
        'node_modules/p5/lib/p5.min.js',
        'node_modules/p5/lib/addons/p5.dom.js',
        'user_modules/esmodule.js',
      ],
      app: [
        'server/config/globe.js',
        'user_modules/emitter.js',
        'user_modules/sph-es.js',
        'sph_plugins/**/*.js'
      ],
      userModules: [
        'node_modules/@esglobe/**/',
        'esglobe_modules/**',
        'user_modules/**'
      ],
      server: [
        "server/**/*.js",
        "!server/public/*"
      ]
    },
    less: {
      app: 'server/less/app.less'
    }
  },
  build: {
    base: 'server/public',
    tmp: 'tmp',
    app: 'app.js',
    vendor: 'vendor.js'
  }
};

paths.concatFiles = paths.src.js.vendor.slice();

gulp.task('default', 'builds js and less to public folder', ['build'], function (cb) {
  gulp.watch(paths.src.js.userModules, ['build']);
  gulp.watch(paths.src.js.app, ['build']);
  gulp.watch(paths.src.js.server, ['build']);
  gulp.watch(paths.src.less.app, ['build']);
});

gulp.task('build', 'builds js and less to public folder', function (cb) {
    runSequence('app-js', 'vendor-js', 'copyModules', 'less', cb);
});

gulp.task('app-js', false, [], function () {
  var stream = gulp.src(paths.src.js.app.slice())
      .pipe(concat(paths.build.app));

  return stream.pipe(gulp.dest(paths.build.base + '/javascripts'));
});

gulp.task('vendor-js', false, [], function () {
  var stream = gulp.src(paths.src.js.vendor.slice())
      .pipe(concat(paths.build.vendor));

  return stream.pipe(gulp.dest(paths.build.base + '/javascripts'));
});

gulp.task('copyModules', false, [], function () {
  return gulp.src(paths.src.js.userModules)
      .pipe(gulpCopy(paths.build.base));
});

// Subtask: Compiles LESS.
gulp.task('less', false, [], function () {
  return gulp.src(paths.src.less.app)
      .pipe(less())
      .on('error', function (error) {
        console.log(error.toString());
        this.emit('end');
      })
      .pipe(gulp.dest(paths.build.base + '/stylesheets'));
});
