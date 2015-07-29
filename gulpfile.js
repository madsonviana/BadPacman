'use restrict';

var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var del = require('del');
var browserSync = require('browser-sync');

var PUBLIC_FOLDER = 'public/';
var SCRIPT_DEST_FOLDER = PUBLIC_FOLDER+'js/'

gulp.task('clean', function(cb) {
    del([SCRIPT_DEST_FOLDER], { force: true}, cb);
});
gulp.task('copy', ['clean'], function(cb) {
    gulp.src('node_modules/phaser/dist/phaser.min.js')
        .pipe(gulp.dest(SCRIPT_DEST_FOLDER))
        .on('end', cb);
});

gulp.task('scripts', ['copy'], function() {

    return gulp.src('scripts/**/*.js')
        .pipe(uglify({mangle: {toplevel: true}}))
        .pipe(concat('game.min.js'))
        .pipe(gulp.dest(SCRIPT_DEST_FOLDER))
        .pipe(browserSync.stream());

});

gulp.task('serve', ['scripts'], function() {
    browserSync({
        server: {
            baseDir: PUBLIC_FOLDER
        }
    });

    gulp.watch('scripts/**/*.js', ['scripts']);
    gulp.watch(['*.html', 'js/**/*js']).on('change', browserSync.reload);
});

gulp.task('default', ['serve']);
