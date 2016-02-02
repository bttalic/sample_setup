// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2015-12-25 using
// generator-karma 1.0.1

module.exports = function (config) {
    'use strict';

    config.set({
        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // base path, that will be used to resolve files and exclude
        basePath: '',

        // testing framework to use (jasmine/mocha/qunit/...)
        // as well as any additional frameworks (requirejs/chai/sinon/...)
        frameworks: [
            "jasmine"
        ],

        // list of files / patterns to load in the browser
        files: [    
        //<!-- testfiles-dep -->   
            "./server/vendor/angular.js",
            "./server/vendor/ng-infinite-scroll.js",
            "./server/vendor/jquery.js",
            "./server/vendor/jcs-auto-validate.js",
            "./server/vendor/bootstrap.min.js",
            "./server/vendor/angular-ui-router.js",
            "./server/vendor/angular-toastr.tpls.js",
            "./server/vendor/angular-storage.js",
            "./server/vendor/angular-sanitize.js",
            "./server/vendor/angular-resource.js",
            "./server/vendor/angular-mocks.js",
            "./server/vendor/angular-cookies.js",
            "./server/vendor/angular-animate.min.js",               
        //<!-- endinject-dep -->
        //<!-- testfiles -->       
            "./T1/spec/sample.spec.js",
            "./T1/src/index.module.js",
            "./T1/src/index.controller.js"                          
            //<!-- endinject -->
        ],
        // list of files / patterns to exclude
        exclude: [
        ],
        // web server port
        port: 8080,
        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: [
            "PhantomJS"
        ],
        // Which plugins to enable
        plugins: [
            "karma-phantomjs-launcher",
            "karma-jasmine"
        ],
        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false,
        colors: true,
        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO,
        // Uncomment the following lines if you are using grunt's server to run the tests
        // proxies: {
        //   '/': 'http://localhost:9000/'
        // },
        // URL root prevent conflicts with the site root
        // urlRoot: '_karma_'
    });
};