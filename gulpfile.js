var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');
var browserify = require('browserify');
var watchify = require('watchify');
var del = require('del');
var ws = require('local-web-server');
var opn = require('opn');
var minimist = require('minimist');

var args = minimist(process.argv.slice(2));

gulp.task('cleanup', function () {
	return del([
		'./test/manual/dist'
	]);
});

gulp.task('style', ['cleanup'], function () {
	function bundle () {
		return gulp.src('./test/manual/assets/**/*')
				.pipe(gulp.dest('./test/manual/dist'));
	}
	if ( args.watch ) {
		gulp.watch('./test/manual/assets/**/*', bundle);
	}
	return bundle();
});

gulp.task('script', ['cleanup'], function () {

	var b = browserify({
		entries: ['./test/manual/basic.js'],
		debug: true,
		cache: {},
		packageCache: {}
	});
	if ( args.watch ) {
		b.plugin(watchify);
	}

	function bundle () {
		return b.bundle()
			.on('error', function ( err ) {
				gutil.log(err.message);
			})
			.pipe(plumber())
			.pipe(source('basic.js'))
			.pipe(buffer())
			.pipe(sourcemaps.init({
				loadMaps: true
			}))
			.pipe(sourcemaps.write())
			.pipe(gulp.dest('./test/manual/dist'));
	}

	bundle();

	if ( args.watch ) {
		b.on('update', bundle);
		b.on('log', gutil.log);
	}

});

gulp.task('test', ['cleanup', 'style', 'script'], function () {
	var port = 8000;
	if ( args.watch ) {
		ws({
			'static': {
				root: './test/manual'
			},
			serveIndex: {
				path: './test/manual'
			}
		}).listen(port);
		opn('http://localhost:' + port);
	}
});
