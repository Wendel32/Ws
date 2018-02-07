var gulp = require('gulp'); // Require gulp

// Sass dependencies
var sass = require('gulp-sass'); // Compile Sass into CSS
var minifyCSS = require('gulp-minify-css'); // Minify the CSS

// Minification dependencies
//var minifyHTML = require('gulp-minify-html'); // Minify HTML
var concat = require('gulp-concat'); // Join all JS files together to save space
var stripDebug = require('gulp-strip-debug'); // Remove debugging stuffs
var uglify = require('gulp-uglify'); // Minify JavaScript
var imagemin = require('gulp-imagemin'); // Minify images

// Other dependencies
var size = require('gulp-size'); // Get the size of the project
var browserSync = require('browser-sync'); // Reload the browser on file changes

// Sprite dependencies
var spritesmith = require('gulp.spritesmith');

// Tasks -------------------------------------------------------------------- >

// Task to compile Sass file into CSS, and minify CSS into build directory
gulp.task('styles', function() {
	gulp.src('./src/sass/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(minifyCSS())
		.pipe(gulp.dest('./build/styles/'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

// Task to create sprite
gulp.task('svg', function () {
	gulp.src('./src/images/interface/*.png')
		.pipe(spritesmith({
			imgName: 'sprite.png',
			cssName: 'sprite.css',
			imgOpts: {
				quality: 100
			}
		}))
		.pipe(gulp.dest('./build/images/interface/'));
});

// Task to minify new or changed HTML pages
gulp.task('html', function() {
	gulp.src('./src/html/*.html')
		.pipe(gulp.dest('./build/'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

// Task to minify images into build
gulp.task('images', function() {
	gulp.src('./src/images/**/*.png')
		.pipe(imagemin({
			progressive: true,
		}))
		.pipe(gulp.dest('./build/images/'));
});

// Task to get the size of the src project
gulp.task('size', function() {
	gulp.src('./src/**')
		.pipe(size({
			showFiles: true,
		}));
});

// Task to get the size of the build project
gulp.task('build-size', function() {
	gulp.src('./build/**')
		.pipe(size({
			showFiles: true,
		}));
});

// Serve srclication
gulp.task('serve', ['styles', 'html', 'images', 'svg', 'size'], function() {
	browserSync.init({
		server: {
			root: 'build',
			baseDir: 'build'
		},
	});
});

// Run all Gulp tasks and serve srclication
gulp.task('default', ['serve', 'styles'], function() {
	gulp.watch('./src/sass/**/*.scss', ['styles']);
	gulp.watch('./src/html/*.html', ['html']);
});
