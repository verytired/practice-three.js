gulp = require 'gulp'
gutil = require 'gulp-util'
parentDir = "practice/"

#load all module
$ = require('gulp-load-plugins')({
	pattern: ['gulp-*', 'gulp.*'],
	replaceString: /\bgulp[\-.]/
})

browserSync = require 'browser-sync'
reload = browserSync.reload
runSequence = require('run-sequence');

gulp.task 'default', ->
	console.log 'gulp!'

#coffee compile
gulp.task 'coffee', ->
	gulp
	.src ['src/coffee/*.coffee']
	.pipe $.plumber()
	.pipe $.coffee()
	.pipe gulp.dest parentDir + 'js'

#typescript compile
gulp.task 'typescript', () ->
	gulp
	.src 'src/typescript/*.ts'
	.pipe $.plumber()
	.pipe $.tsc()
	.pipe gulp.dest parentDir + 'js'

#sass compile
gulp.task 'sass',()->
	gulp
	.src './src/css/*.scss'
	.pipe $.plumber()
	.pipe $.rubySass()
	.pipe gulp.dest parentDir + 'css'

#run server / watch
gulp.task 'serve', ['default'], ->
	browserSync
		notify: false
		server:
			baseDir: [parentDir]
	gulp.watch ['src/coffee/*.coffee'], ['script']
	gulp.watch ['src/typescript/*.ts'], ['script_type']
	gulp.watch ['src/css/*.scss'], ['script_sass']
	gulp.watch ['practice/data/shader/*.*'], ['script_type']
	gulp.watch [parentDir + '*.html'], reload

#coffee compile&reload
gulp.task 'script', ->
	runSequence 'coffee', reload

#typescript compile&reload
gulp.task 'script_type', ->
	runSequence 'typescript', reload

#typescript compile&reload
gulp.task 'script_sass', ->
	runSequence 'sass', reload
