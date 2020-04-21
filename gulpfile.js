// Initialize modules
// Importing specific gulp API functions lets us write them below as series() instead of gulp.series()
const { src, dest, watch, series, parallel } = require('gulp');
// Importing all the Gulp-related packages we want to use
const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const replace = require('gulp-replace');
const webserver = require('gulp-webserver');
const gutil = require('gulp-util');

// File paths
const files = {
    scssPath: 'app/scss/**/*.scss',
    jsPath: 'app/js/**/*.js'
}

// Sass task: compiles the style.scss file into style.css
function scssTask(){
    return src('app/scss/style.scss')
        .pipe(sourcemaps.init()) // initialize sourcemaps first
        .pipe(sass()) // compile SCSS to CSS
        .pipe(postcss([ autoprefixer(), cssnano() ])) // PostCSS plugins
        .pipe(sourcemaps.write('.')) // write sourcemaps file in current directory
        .pipe(dest('dist')
    ); // put final CSS in dist folder
}

// JS task: concatenates and uglifies JS files to script.js
function jsTask(){
    return src([
          // './lib/js/d3-dispatch.v1.min.js',
          // './lib/js/d3-quadtree.v1.min.js',
          // './lib/js/d3-timer.v1.min.js',
          // './lib/js/d3-force.v2.min.js',
          // './node_modules/d3-dispatch/dist/d3-dispatch.min.js',
          // './node_modules/d3-quadtree/dist/d3-quadtree.min.js',
          // './node_modules/d3-timer/dist/d3-timer.min.js',
          // './node_modules/d3-force/dist/d3-force.min.js',

          './lib/js/d3.v5.min.js',
          './lib/js/vis-network.min.js',
          files.jsPath,
        ])
        .pipe(concat('all.js'))
        .pipe(gutil.env.env === 'production' ? uglify() : gutil.noop())
        .pipe(dest('dist')
    );
}

// Watch task: watch SCSS and JS files for changes
// If any change, run scss and js tasks simultaneously
function watchTask(){
    watch([files.scssPath, files.jsPath],
        {interval: 1000, usePolling: true}, //Makes docker work
        series(
            parallel(scssTask, jsTask)
        )
    );
}

// webserver
function webserverTask(){
  gulp.src('./')
    .pipe(webserver({
      livereload: true,
      directoryListing: true,
      open: true
    }));
}

// Export the default Gulp task so it can be run
// Runs the scss and js tasks simultaneously
// then runs cacheBust, then watch task
exports.default = series(
    parallel(scssTask, jsTask)
);

// Export the watch task
exports.watch =  series(parallel(scssTask, jsTask), parallel(webserverTask, watchTask));
