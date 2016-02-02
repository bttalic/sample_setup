var gulp = require('gulp'),
    watch = require('gulp-watch'),
    inject = require('gulp-inject'),
    angularFilesort = require('gulp-angular-filesort'),
    naturalSort = require('gulp-natural-sort'),
    bower = require('gulp-bower'),
    bowerFiles = require('main-bower-files'),
    Server = require('karma').server,
    webserver = require('gulp-webserver'),
    flatten = require('gulp-flatten'),
    filter = require('gulp-filter'),
    sync = require("browser-sync"),
    clean = require('gulp-clean');

var appSrc = './Part5/end/',
    sourceAngular = appSrc + 'src/',
    sourceAgularTest = appSrc + 'spec/',
    destinationAngular = './server/app/',
    sourceView = appSrc + 'index.html',
    sourceStyle = appSrc + 'css/',
    destinationStyle = './server/css/',
    targetView = './server/',
    bowerPublic = './server/vendor/';

gulp.task('clean-public-angular', function () {
    return gulp.src(destinationAngular, { read: false })
        .pipe(clean({ force: true }));
});

gulp.task('clean-public-bower', function () {
    return gulp.src(bowerPublic+'/**/*.*', { read: false })
        .pipe(clean({ force: true }));
});

gulp.task('clean-public-css', function () {
    return gulp.src(destinationStyle, { read: false })
        .pipe(clean({ force: true }));
});

//copy files from dev folder to web folder
gulp.task('watch-angular', ['clean-public-angular'], function () {
    gulp.src(sourceAngular + '/**/*.*')
        .pipe(watch(sourceAngular + '/**/*.*', function () {
            gulp.start('inject-files');
        }))
        .pipe(gulp.dest(destinationAngular));
});

gulp.task('watch-css', ['clean-public-css'], function () {
    gulp.src(sourceStyle + '/**/*.css')
        .pipe(watch(sourceStyle + '/**/*.css', function () {
            gulp.start('inject-files');
        }))
        .pipe(gulp.dest(destinationStyle));
});

gulp.task('watch-bower', function () {
    gulp.watch('./bower.json', function () {
        gulp.start('copy-bower');
    });
});

gulp.task('watch-index', function () {
    gulp.watch(sourceView, function () {
        gulp.start('inject-files');
    });
});

//inject js files into html
gulp.task('inject-files', ['copy-bower', 'bower-fonts'], function () {
    //If you need files included before others and gulp does not do it on its own
    //put them in the right order in this array
    var dependencieFiles = [
        bowerPublic + '/angular.js',
        bowerPublic + '/jquery.js'
    ];
    var ignorePath = "server/";
    gulp.src(sourceView)

        .pipe(inject(
            gulp.src(dependencieFiles, { read: false }),
            {
                name: 'dependencies',
                ignorePath: ignorePath
            }
            ))
        .pipe(inject(
            gulp.src(destinationAngular + '/**/*.js').pipe(angularFilesort()),
            {
                name: 'angularapp',
                ignorePath: ignorePath
            }
            ))
        .pipe(inject(
            gulp.src(destinationStyle + '/**/*.css'),
            {
                name: 'customcss',
                ignorePath: ignorePath
            }
            ))
        .pipe(inject(
            gulp.src(setIgnore(dependencieFiles, [bowerPublic + '/**/*.js'])).pipe(naturalSort()).pipe(angularFilesort()),
            {
                name: 'bower',
                ignorePath: ignorePath
            }
            ))
        .pipe(inject(
            gulp.src(setIgnore(dependencieFiles, [bowerPublic + '/**/*.css']), { read: false }),
            {
                name: 'bower',
                ignorePath: ignorePath
            }
            ))
        .pipe(gulp.dest(targetView));
});

//Copy bower files from this to public folder
gulp.task('copy-bower', ['bower'], function () {
    var options = {
        base: './bower_components', /* the path to the bower_components directory */
        dest: bowerPublic
    };
    var files = bowerFiles(options);
    return gulp.src(files)
        .pipe(gulp.dest(bowerPublic))

});

gulp.task('bower', function () {
    bower();
});

gulp.task('bower-fonts', function () {
    return gulp.src(bowerFiles(), {
        base: './bower_components'
    })
        .pipe(filter([
            '**/*.{png,gif,svg,jpeg,jpg,woff,eot,ttf}',
            '!foundation/**/*',
            '!compass-mixins/**/*'
        ]))
        .pipe(flatten())
        .pipe(gulp.dest('./server/fonts'));
});

gulp.task('karma-inject', function () {
    gulp.src('./karma.conf.js')
        .pipe(inject(
            gulp.src(
                [
                    "./server/vendor/**/*.js"
                ]).pipe(angularFilesort()), {
                starttag: '//<!-- testfiles-dep -->',
                endtag: ' //<!-- endinject-dep -->',
                transform: function (filepath, file, i, length) {
                    return '  ".' + filepath + '",'
                }
            }))
        .pipe(inject(
            gulp.src(
                [
                    sourceAngular + '/**/*.js',
                    sourceAgularTest + '/**/*.js',
                ]).pipe(angularFilesort()), {
                starttag: '//<!-- testfiles -->',
                endtag: ' //<!-- endinject -->',
                transform: function (filepath, file, i, length) {
                    return '  ".' + filepath + '"' + (i + 1 < length ? ',' : '');
                }
            }))
        .pipe(gulp.dest('./'));
});

gulp.task('test', function (done) {
    Server.start({
        configFile: require('path').resolve('karma.conf.js'),
        singleRun: false
    }, done);
});

gulp.task('webserver', function () {
    gulp.src('./server/')
        .pipe(webserver({
            port: 9001,
            livereload: true,
            directoryListing: false,
            open: true
        }));
});

gulp.task('serve:dev', ['watch-angular', 'watch-css', 'watch-bower', 'watch-index', 'inject-files', 'webserver']);

function setIgnore(arrayToIgnore, arrayToUse) {
    for (var i = 0; i < arrayToIgnore.length; i++) {
        arrayToIgnore[i] = '!' + arrayToIgnore[i];
    }
    return arrayToUse.concat(arrayToIgnore);
}