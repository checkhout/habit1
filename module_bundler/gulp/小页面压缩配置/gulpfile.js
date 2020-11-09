const gulp = require("gulp");
const gulpBabel = require("gulp-babel");
const gulpHtmlMin = require('gulp-htmlmin');
const gulpImgsmin = require('gulp-imagemin');
const gulpUglify = require("gulp-uglify");
const gulpClean = require('gulp-clean');
const gulpCssMin = require('gulp-clean-css');
const removeUseStrict = require('gulp-remove-use-strict');


gulp.task('clean', done => {
	gulp.src('dist/**')
		.pipe(gulpClean({read: false}));
	done();
});
gulp.task('htmlmin', done => {
	gulp.src(['src/index.html', 'src/buySuccess.html'])
		.pipe(gulpHtmlMin({
			collapseWhitespace: true,
			removeComments: true
		}))
		.pipe(gulp.dest('dist'));
	done();
});
gulp.task('cssmin', done => {
	gulp.src(['src/style/app.css', 'src/style/buySuccess.css'])
		.pipe(gulpCssMin())
		.pipe(gulp.dest('dist/style'));
	done();
});
gulp.task('imgmin', done => {
	gulp.src('src/images/**/*')
		.pipe(gulpImgsmin())
		.pipe(gulp.dest('dist/images'));
	done();
});
gulp.task('jsmin', done => {
	gulp.src('src/js/*.js')
		.pipe(gulpBabel({
			presets: ['@babel/preset-env']
		}))
		.pipe(gulpUglify({
			sourceMap: false,
			compress: {
				warnings: false,
				drop_console: true,
				drop_debugger: true,
			},
			mangle: true
		}))
		.pipe(gulp.dest('dist/js'));
	done();
});
gulp.task('jscopy', done => {
	gulp.src('src/js/plugin/*.js')
		.pipe(gulp.dest('dist/js/plugin'));
	done();
});
gulp.task('removeUseStrict', done => {
	gulp.src('dist/js/*.js')
		.pipe(removeUseStrict())
		.pipe(gulp.dest('dist/js/*.js'));
	done();
});
gulp.task("default", gulp.series('clean',gulp.parallel('htmlmin', 'cssmin', 'imgmin', 'jsmin' , 'jscopy')), done => {
	done();
});

