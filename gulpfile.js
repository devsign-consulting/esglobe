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
var clean = require('gulp-clean');
var exec = require('child-process-promise').exec;
var spawn = require('child-process-promise').spawn;

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
                'esglobe_modules/**/*.js',
                'esglobe_modules/**/*.css',
                'esglobe_modules/**/images/**',
                'user_modules/**'
            ],
            server: [
                "server/**/*.js",
                "!server/public/*"
            ]
        },
        images: [
            'client/images/**',
        ],
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

var execSpawn = function (cmd, flags) {
    // converts v1.0.0 to 1.0.0 and removes line breaks
    var promise = spawn(cmd, flags);
    var childProcess = promise.childProcess;

    console.log('[spawn] childProcess.pid: ', childProcess.pid);
    childProcess.stdout.on('data', function (data) {
        console.log(data.toString());
    });
    childProcess.stderr.on('data', function (data) {
        console.log('[spawn] stderr: ', data.toString());
    });

    return promise.then(function () {
        console.log('[spawn] done!');
        return;
    })
        .catch(function (err) {
            console.error('[spawn] ERROR: ', err);
            return;
        });
};

var getTag = function () {
    return exec('git describe --tags --abbrev=0')
        .then(function (res) {
            // converts v1.0.0 to 1.0.0 and removes line breaks
            var tag = res.stdout.replace(/(\r\n|\n|\r|[v])/gm, "");
            return tag;
        });
};

paths.concatFiles = paths.src.js.vendor.slice();

gulp.task('default', 'builds js and less to public folder', ['build'], function (cb) {
    gulp.watch(paths.src.js.userModules, ['build']);
    gulp.watch(paths.src.js.app, ['build']);
    gulp.watch(paths.src.js.server, ['build']);
    gulp.watch(paths.src.less.app, ['build']);
    console.log("watching folders for changes... please start the web server using npm start in a separate terminal window")
});

gulp.task('build', 'builds js and less to public folder', function (cb) {
    runSequence('clean', 'app-js', 'vendor-js', 'copyModules', 'copyImages', 'less', cb);
});

gulp.task('app-js', false, [], function () {
    var stream = gulp.src(paths.src.js.app.slice())
        .pipe(concat(paths.build.app));

    return stream.pipe(gulp.dest(paths.build.base + '/javascripts'));
});

gulp.task('clean', false, [], function () {
    return gulp.src(paths.build.base, {read: false})
        .pipe(clean());
});

gulp.task('docker-build', false, ['build'], () => {
    process.env.NODE_CONFIG_DIR = './server/config';
    var config = require('config');

    var flags = [
        'build',
        `-t`,
        `${config.name}`,
        '.'
    ];

    //return exec(`docker build --build-arg NPM_TOKEN=${config.npm.auth} -t ${config.name} .`, { maxBuffer: 1024 * 500 })
    return execSpawn('docker', flags)
        .then(function () {
            return getTag()
                .then(function (tag) {
                    console.log("Docker Tag:", tag);
                    return exec(`docker tag ${config.name}:latest ${config.name}:${tag}`);
                });
        })
        .catch(err => {
            console.log(err);
        });
});

gulp.task('docker-run', false, ['build'], () => {
    process.env.NODE_CONFIG_DIR = './server/config';
    var config = require('config');
    return exec(`docker stop ${config.name}`)
        .then(() => {
            return exec(`docker run -d --rm -p 3000:3000 --name ${config.name} ${config.name}:latest`);
        })
        .catch(() => {
            return exec(`docker run -d --rm -p 3000:3000 --name ${config.name} ${config.name}:latest`);
        })
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

gulp.task('copyImages', false, [], function () {
    return gulp.src(paths.src.images)
        .pipe(gulpCopy(paths.build.base, {prefix: 1}));
})

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
