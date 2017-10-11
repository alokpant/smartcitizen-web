'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var replace = require('replace');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

module.exports = function(options) {
  gulp.task('partials', function () {
    return gulp.src([
      options.src + '/app/**/*.html',
      options.tmp + '/serve/app/**/*.html'
    ])
      .pipe($.minifyHtml({
        empty: true,
        spare: true,
        quotes: true
      }))
      .pipe($.angularTemplatecache('templateCacheHtml.js', {
        module: 'app',
        root: 'app'
      }))
      .pipe(gulp.dest(options.tmp + '/partials/'));
  });

  gulp.task('html', ['inject', 'partials'], function () {
    var partialsInjectFile = gulp.src(options.tmp + '/partials/templateCacheHtml.js', { read: false });
    var partialsInjectOptions = {
      starttag: '<!-- inject:partials -->',
      ignorePath: options.tmp + '/partials',
      addRootSlash: false
    };

    var htmlFilter = $.filter('*.html');
    var jsFilter = $.filter('**/*.js', '!'+options.src+'/**/scktool-*.js');
    var cssFilter = $.filter('**/*.css');
    var assets;

    return gulp.src(options.tmp + '/serve/*.html')
      .pipe($.inject(partialsInjectFile, partialsInjectOptions))
      .pipe(assets = $.useref.assets())
      .pipe($.rev())
      .pipe(jsFilter)
      .pipe($.ngAnnotate())
      .pipe($.uglify({ preserveComments: $.uglifySaveLicense })).on('error', options.errorHandler('Uglify'))
      .pipe(jsFilter.restore())
      .pipe(cssFilter)
      .pipe($.csso())
      .pipe(cssFilter.restore())
      .pipe(assets.restore())
      .pipe($.useref())
      .pipe($.revReplace())
      .pipe(htmlFilter)
      .pipe($.minifyHtml({
        empty: true,
        spare: true,
        quotes: true,
        conditionals: true
      }))
      .pipe(htmlFilter.restore())
      .pipe(gulp.dest(options.dist + '/'))
      .pipe($.size({ title: options.dist + '/', showFiles: true }));
  });

  // Only applies for fonts from bower dependencies
  // Custom fonts are handled by the "other" task
  gulp.task('fonts', function () {
    return gulp.src($.mainBowerFiles())
      .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
      .pipe($.flatten())
      .pipe(gulp.dest(options.dist + '/fonts/'));
  });

  gulp.task('other', function () {
    return gulp.src([
      options.src + '/**/*',
      '!' + options.src + '/**/*.{html,css,js,scss}'
    ])
      .pipe(gulp.dest(options.dist + '/'));
  });


  gulp.task('version', function(){
    var p = require('./../package.json');
    gutil.log(' -- The version is now: ' + p.version);

    var revision = require('child_process')
    .execSync('git rev-parse HEAD')
    .toString().trim().substring(0,7)

    gutil.log('Git hash is: ' + revision);

    replace({
      regex: "Version.*",
      replacement: "Version: " + p.version + '. Hash: ' + revision,
      paths: ['./src/app/components/footer/footer.html'],
      recursive: true,
      silent: true,
    });

  });


  gulp.task('clean', function (done) {
    $.del([options.dist + '/', options.tmp + '/'], done);
  });

  gulp.task('external-assets', function() {
    return gulp.src(['bower_components/leaflet/dist/images/**'])
      .pipe(gulp.dest(options.dist + '/styles/images'));
  });

  gulp.task('oldModule-js', function() {
    return gulp.src([
      options.src + '/app/components/kit/setupModule/scktool-app.js',
      options.src + '/app/components/kit/setupModule/scktool-connector.js'
    ])
      .pipe(gulp.dest(options.dist + '/scripts/'));
  });

  gulp.task('build', ['html', 'fonts', 'other', 'external-assets', 'oldModule-js', 'version']);
};