// grab gulp packages
var gulp = require("gulp");
var gutil = require("gulp-util");

var jshint = require("gulp-jshint");
var changed = require("gulp-changed");
var imagemin = require("gulp-imagemin");
var minifyHtml = require("gulp-minify-html");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var sass = require("gulp-sass");
var cleanCss = require("gulp-clean-css");
var ngAnnotate = require("gulp-ng-annotate");
var sourcemaps = require("gulp-sourcemaps");
var protractor = require("gulp-protractor").protractor;

// JS hint task
gulp.task("jshint", function() {
   gulp.src("./public/js/*.js")
       .pipe(jshint())
       .pipe(jshint.reporter("default"));
});

// minify new images
gulp.task("imagemin", function() {
    var imgSrc = "./public/img/**/*";
    var imgDst = "./public/build/images";

    gulp.src(imgSrc)
        .pipe(changed(imgDst))
        .pipe(imagemin())
        .pipe(gulp.dest(imgDst));
});

// minify new or changed HTML pages
gulp.task("htmlpage", function() {
    var htmlSrc = "./public/views/*.html";
    var htmlDst = "./build/views";

    gulp.src(htmlSrc)
        .pipe(changed(htmlDst))
        .pipe(minifyHtml())
        .pipe(gulp.dest(htmlDst));
});

// JS concat and minify
gulp.task("scripts", function() {
   gulp.src(["./public/js/*.js"])
       .pipe(sourcemaps.init())
            .pipe(concat("script.js"))
            .pipe(ngAnnotate())
            .pipe(uglify())
       .pipe(sourcemaps.write())
       .pipe(gulp.dest("./build/scripts/"));
});

// SASS compilation and minify
gulp.task("styles", function() {
   gulp.src(["./public/sass/**/*.scss"])
       .pipe(concat('styles.scss'))
       .pipe(sass())
       .pipe(cleanCss())
       .pipe(gulp.dest("./build/styles/"));
});

// Protractor test
gulp.task("protractor", function() {
    gulp.src(["./test/protractor/*.js"])
        .pipe(protractor({
            configFile: "./test/protractor.config.js",
            args: ['--baseUrl', 'http://localhost:8000']
        }))
        .on("error", function(e) { throw e; });
});

// default task
gulp.task("default", ["imagemin", "htmlpage", "scripts", "styles"], function() {
    var html = ["htmlpage"];
    var js = ["scripts"];
    var css = ["styles"];

    // watch for HTML changes
    gulp.watch("./public/views/**/*.html", html);

    // watch for JS changes
    gulp.watch("./public/js/**/*.js", js);

    // watch for SCSS changes
    gulp.watch("./public/sass/**/*.scss", css);
});