var gulp = require('gulp'),
  less = require('gulp-less'),
  mainBowerFiles = require('main-bower-files'),
  minifyCSS = require('gulp-minify-css'),
  rename = require('gulp-rename'),
  server = require('gulp-express'),
  swig = require('gulp-swig'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  minifyCSS = require('gulp-minify-css');

gulp.task('server', function() {
  server.run(['app.js']);
});

gulp.task('js', function () {
  gulp.src('./assets/js/*.js')
  .pipe(server.notify());
});

gulp.task('css', function () {
  gulp.src('./assets/css/*.css')
  .pipe(server.notify());
});

gulp.task('html', function () {
  gulp.src('*.html')
  .pipe(server.notify());
});

gulp.task('less', function () {
  gulp.src('./less/**/*.less')
  .pipe(less())
  .pipe(gulp.dest('./assets/css'));
});

gulp.task('watch', function () {

	// HTML
  gulp.watch([
  	'*.html',
  	'./views/*.html',
  	'./views/*/*.html',
    './views/*/*/*.html',
    './views/*/*/*/*.html',
    './assets/components/*/*.html',
    './assets/partials/*.html',
    './assets/partials/*/*.html'
  	], function(event){

      server.stop();
      server.run(['app.js']);
      server.notify(event);

    });

	// CSS
  gulp.watch([
   './assets/css/*.css',
   './views/*.css',
   './views/*/*.css',
   './assets/components/*/*.css'
   ], ['css']);

	// JS
  gulp.watch([
   './assets/js/*.js',
   './views/*.js',
   './views/*/*.js',
   './assets/components/*/*.js'
   ], ['js']);

  // LESS
  gulp.watch([
    './less/*.less',
    './less/*/*.less'
    ], ['less']);

    //gulp.watch(['less/variables.less'],
    //['custom-bootstrap']);

});

gulp.task('bower', function(){
  return gulp.src(mainBowerFiles(), {
    base : '/assets/libs'
  }).pipe(gulp.dest('/assets/libs'));
});

gulp.task('bootstrap:prepareLess', ['bower'], function() {
  return gulp.src('./less/variables.less')
  .pipe(gulp.dest('./assets/libs/bootstrap/less/'));
});

gulp.task('minify-custom-bootstrap-css', ['bootstrap:compileLess'], function() {
  return gulp.src('./assets/libs/bootstrap/dist/css/bootstrap.css')
    .pipe(minifyCSS({keepBreaks:false}))
    .pipe(rename('bootstrap.min.css'))
    .pipe(gulp.dest('./assets/libs/bootstrap/dist/css/'))
});

gulp.task('bootstrap:compileLess', ['bootstrap:prepareLess'],
function(){
  return gulp.src('./assets/libs/bootstrap/less/bootstrap.less')
  .pipe(less())
  .pipe(gulp.dest('./assets/libs/bootstrap/dist/css'));
});


gulp.task("copy-assets", function(){
  return gulp.src(["./assets/**/*", "!./assets/js/**/*", "!./assets/css/**"], {base : './assets/'})
  .pipe(gulp.dest("/usr/local/var/www/delosi/"));
});

gulp.task("copy-css", function(){
  return gulp.src("./assets/css/*" , {base : './assets/'})
  .pipe(minifyCSS({keepBreaks:true}))
  .pipe(gulp.dest("/usr/local/var/www/delosi/"));
});

gulp.task("copy-js", function(){
  return gulp.src("./assets/js/**/*" , {base : './assets/'})
  .pipe(uglify())
  .pipe(gulp.dest("/usr/local/var/www/delosi/"));
});

gulp.task("copy-index", function(){
  return gulp.src("./views/index.html")
  .pipe(swig())
  .pipe(gulp.dest("/usr/local/var/www/app/"))
});

gulp.task("copy-views", function(){
  return gulp.src("./views/**/*.html", {base : '.'})
  .pipe(swig())
  .pipe(gulp.dest("/usr/local/var/www/app/"));
});

//gulp.task('custom-bootstrap', ['bootstrap:prepareLess', 'bootstrap:compileLess', 'minify-custom-bootstrap-css'])
gulp.task('default', ['server', 'watch', 'less']);
gulp.task('dist', ["copy-index", "copy-views", "copy-assets", "copy-js", "copy-css"]);