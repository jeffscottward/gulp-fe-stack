// Require Gulp Modules
var gulp =             require('gulp'); // Used
var gulpAutoprefixer = require('gulp-autoprefixer'); // Not-Used
var gulpCleanhtml =    require('gulp-cleanhtml'); // Not-Used
var gulpCoffee =       require('gulp-coffee');
var gulpConcat =       require('gulp-concat');
var gulpGit =          require('gulp-git'); // Not-Used
var gulpJade =         require('gulp-jade');
var gulpLivereload =   require('gulp-livereload');
var gulpNewer =        require('gulp-newer');
var gulpSass =         require('gulp-sass');
var gulpUglify =       require('gulp-uglify');
var gulpUtil =         require('gulp-util');
var gulpImagemin =     require('gulp-imagemin');
var gulpConnect =      require('gulp-connect');

// App path references
var app = {};

    app.sourcePath = 'src/'; // Source
    app.destinationPath = 'dest/'; // Destination
    app.paths = {};

    app.paths.source = {
      html: app.sourcePath, // HTML
      css: app.sourcePath + 'scss/', // CSS
      js: app.sourcePath + 'coffee/', // JS
      img: app.sourcePath + 'img/' // IMG
    };

    app.paths.destination = {
      html: app.destinationPath, // HTML
      css: app.destinationPath + 'css/', // CSS
      js: app.destinationPath + 'js/', // JS
      img: app.destinationPath + 'img/' // IMG
    };

// Build HTML files
gulp.task('buildHTML', function() {

  return gulp.src(app.paths.source.html)
      .pipe(gulpNewer(app.paths.source.html))
      .pipe(gulpJade())
      .pipe(gulp.dest(app.paths.destination.html))
      .on('error', gulpUtil.log);
});

// Build CSS files
gulp.task('buildCSS', function() {

  return gulp.src(app.paths.source.css)
      .pipe(gulpNewer(app.paths.source.css))
      .pipe(gulpSass({outputStyle:'compressed',sourceComments:'map'}))
      .pipe(gulp.dest(app.paths.destination.css))
      .on('error', gulpUtil.log);
});

// Build JS files
gulp.task('buildJS', function() {

  return gulp.src(app.paths.source.js)
      .pipe(gulpNewer(app.paths.source.js))
      .pipe(gulpConcat('app.min.js'))
      .pipe(gulpUglify())
      .pipe(gulp.dest(app.paths.destination.js))
      .on('error', gulpUtil.log);
});

// Build IMG files
gulp.task('buildIMG', function () {

  return gulp.src(app.paths.source.img)
    .pipe(gulpNewer(app.paths.source.img))
    .pipe(gulpImagemin())
    .pipe(gulp.dest(app.paths.destination.img))
    .on('error', gulpUtil.log);
});

// Build tasks ( w/ alias for rebuild )
gulp.task('build', function() {gulp.start('buildHTML', 'buildCSS', 'buildJS', 'buildIMG');});
gulp.task('rebuild', function() {gulp.start('buildHTML', 'buildCSS', 'buildJS', 'buildIMG');});

// Start a node server
gulp.task('server', function(next) {

  gulpConnect.server({
    root: app.destinationPath,
    livereload: true
  });
});

// Watch files
gulp.task('watch', ['server'], function() {

  var server = gulpLivereload();

  gulp.watch(app.sourcePath + '**/**')
      .on('change', function(file) {
        gulp.start('build');
        server.changed(file.path);
      });
});

// Default task - build first then watch files and start server
gulp.task('default', ['build', 'watch']);
