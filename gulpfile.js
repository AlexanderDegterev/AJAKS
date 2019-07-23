// Gulp.js настройки
'use strict';


const

    // исходная папка и папка билда
    dir = {
        root : 'src/',
        js : root + 'js',
        scss : root + 'scss',
        build : 'wp-content/themes/eightmedi-lite-child/'
    };

    // Gulp и плагины

var gulp = require( 'gulp' ),
    autoprefixer = require( 'gulp-autoprefixer' ), // Autoprefixing magic.
    browserSync  = require( 'browser-sync' ).create(),
    reload  = browserSync.reload,
    sass  = require( 'gulp-sass' ), // Gulp pluign for Sass compilation.
    cleanCSS  = require( 'gulp-clean-css' ),
    sourcemaps  = require( 'gulp-sourcemaps' ),
    concat  = require( 'gulp-concat' ),
    imagemin  = require( 'gulp-imagemin' ),
    changed = require( 'gulp-changed' ),
    uglify  = require( 'gulp-uglify' ),
    lineec  = require( 'gulp-line-ending-corrector' ); // Consistent Line Endings for non UNIX systems. Gulp Plugin for Line Ending Corrector (A utility that makes sure your files have consistent line endings)

    var root  = 'src/', // НЕ УДАЛЯТЬ
    product = 'production/';

// Watch Files

var
    JSWatchFiles  = root + 'js/*.js',
    PHPFiles = root + '/*.php',
    SCSSFiles = root + 'scss/*.scss',
    HTMLFiles = root + '/*.html';


var imgSRC = root + 'images/*',
    imgDEST = 'production/images/',
    cssDEST = 'production/css/',
    jsDEST = 'production/js/';

function php() {
    return gulp.src(HTMLFiles)
        .pipe(gulp.dest(wpThemeChild));
}

function html() {
    return gulp.src(HTMLFiles)
        .pipe(gulp.dest(product));
}

function js_new() {
    return gulp.src(JSWatchFiles)
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(lineec())
        .pipe(gulp.dest(jsDEST));
}

function scss() {
    return gulp.src(SCSSFiles)
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('style.css'))
        .pipe(sourcemaps.write())
        // .pipe(sourcemaps.init({loadMaps: true}))
        // .pipe(sass({
        //     outputStyle: 'expanded'
        // }).on('error', sass.logError))
        .pipe(autoprefixer('last 2 versions'))
        // .pipe(sourcemaps.write())
        // .pipe(lineec())
        .pipe(gulp.dest(cssDEST));
}

function imgmin() {
    return gulp.src(imgSRC)
        .pipe(changed(imgDEST))
        .pipe( imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 5})
        ]))
        .pipe(gulp.dest(imgDEST));
}

function watch2() {
    browserSync.init({
        // open: 'external',
        open: 'local',
        proxy: 'http://localhost/MEDNVDGRODNO',
        port: 8080,
    });
    gulp.watch(PHPFiles, php);
    gulp.watch(JSWatchFiles, js_new);
    gulp.watch(SCSSFiles, scss);
    // gulp.watch(imgSRC, imgmin);
    gulp.watch([PHPFiles, JSWatchFiles, SCSSFiles]).on('change', browserSync.reload);
}
// exports.concatCSS = concatCSS;
// exports.javascript = javascript;
exports.imgmin = imgmin;

var build2 = gulp.parallel(watch2);
gulp.task('default', build2);

gulp.task('php',php);
gulp.task('js',js_new);
gulp.task('scss',scss);
gulp.task('img',imgmin);
gulp.task('html',html);