gulp = require 'gulp'
gutil = require 'gulp-util'

#load all module
$ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'gulp.*'],
  replaceString: /\bgulp[\-.]/
})

gulp.task 'default', ->
  console.log 'gulp!'

#coffeeコンパイル&結合
gulp.task 'coffee', ->
  gulp
  .src ['coffee/*.coffee']
  .pipe $.coffee()
  .pipe gulp.dest 'js'
