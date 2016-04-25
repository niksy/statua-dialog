var path = require('path');
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
var globby = require('globby');
var es = require('event-stream');

var args = minimist(process.argv.slice(2));

gulp.task('cleanup', function () {
	return del([
		'./test-dist'
	]);
});

gulp.task('markup', ['cleanup'], function () {
	function bundle () {
		return gulp.src('./test/manual/**/*.html')
				.pipe(gulp.dest('./test-dist'));
	}
	if ( args.watch ) {
		gulp.watch(['./test/manual/**/*.html'], bundle);
	}
	return bundle();
});

gulp.task('style', ['cleanup'], function () {
	function bundle () {
		return gulp.src('./test/manual/assets/**/*.css')
				.pipe(gulp.dest('./test-dist/assets'));
	}
	if ( args.watch ) {
		gulp.watch(['./test/manual/assets/**/*.css'], bundle);
	}
	return bundle();
});

gulp.task('script', ['cleanup'], function ( done ) {

	globby(['./test/manual/**/*.js'])
	.then(function ( files ) {

		function task ( file ) {

			var b = browserify({
				entries: [file],
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
					.pipe(source(path.basename(file)))
					.pipe(buffer())
					.pipe(sourcemaps.init({
						loadMaps: true
					}))
					.pipe(sourcemaps.write())
					.pipe(gulp.dest(path.join('./test-dist', path.dirname(file).split(path.sep).pop())));
			}

			if ( args.watch ) {
				b.on('update', bundle);
				b.on('log', gutil.log);
			}

			return bundle();

		}

		es.merge(files.map(task)).on('end', done);

	})
	.catch(function ( err ) {
		done(err);
	});

});

gulp.task('test', ['cleanup', 'markup', 'style', 'script'], function () {
	var port = 8000;
	if ( args.watch ) {
		ws({
			'static': {
				root: './test-dist'
			},
			serveIndex: {
				path: './test-dist'
			}
		}).listen(port);
		opn('http://localhost:' + port);
	}
});
