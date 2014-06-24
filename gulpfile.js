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
var gulpWatch =        require('gulp-watch');
var gulpPlumber =      require('gulp-plumber');

// App path references
var app = {};

    app.sourcePath = 'src/';       // Source
    app.destinationPath = 'dest/'; // Destination
    app.paths = {};

    app.paths.source = {
      html: app.sourcePath + '**/*.jade',   // HTML
      css: app.sourcePath + 'scss/**/*.**', // CSS
      js: app.sourcePath + 'coffee/**/*.**',// JS
      img: app.sourcePath + 'img/**/*.**'   // IMG
    };

    app.paths.destination = {
      html: app.destinationPath,          // HTML
      css: app.destinationPath + 'css/',  // CSS
      js: app.destinationPath + 'js/',    // JS
      img: app.destinationPath + 'img/'   // IMG
    };

// Build HTML files
gulp.task('buildHTML', function() {

  return gulp.src(app.paths.source.html)
    .pipe(gulpNewer(app.paths.source.html))
    .pipe(gulpWatch(function(files) {
      return files.pipe(gulpJade())
                  .pipe(gulp.dest(app.paths.destination.html))
                  // .pipe(gulpGit.add())
                  // .pipe(gulpGit.commit('HTML commit' + new Date()))
                  .pipe(gulpLivereload())
                  .on('error', gulpUtil.log);
    }));
});

// Build CSS files
gulp.task('buildCSS', function() {

  return gulp.src(app.paths.source.css)
    .pipe(gulpNewer(app.paths.source.css))
    .pipe(gulpWatch(function(files) {
      return files.pipe(gulpSass({outputStyle:'compressed',sourceComments:'map'}))
                  .pipe(gulp.dest(app.paths.destination.css))
                  // .pipe(gulpGit.add())
                  // .pipe(gulpGit.commit('CSS commit' + new Date()))
                  .pipe(gulpLivereload())
                  .on('error', gulpUtil.log);
    }));
});

// Build JS files
gulp.task('buildJS', function() {

  return gulp.src(app.paths.source.js)
    .pipe(gulpNewer(app.paths.source.js))
    .pipe(gulpWatch(function(files) {
      return files.pipe(gulpConcat('app.min.js'))
                  .pipe(gulpUglify())
                  .pipe(gulp.dest(app.paths.destination.js))
                  // .pipe(gulpGit.add())
                  // .pipe(gulpGit.commit('JS commit' + new Date()))
                  .pipe(gulpLivereload())
                  .on('error', gulpUtil.log);
    }));
});

// Build IMG files
gulp.task('buildIMG', function () {

  return gulp.src(app.paths.source.img)
    .pipe(gulpNewer(app.paths.source.img))
    .pipe(gulpWatch(function(files) {
      return files.pipe(gulpImagemin())
                  .pipe(gulp.dest(app.paths.destination.img))
                  // .pipe(gulpGit.add())
                  // .pipe(gulpGit.commit('IMG commit' + new Date()))
                  .pipe(gulpLivereload())
                  .on('error', gulpUtil.log);
    }));
});

// Build tasks ( w/ alias for rebuild )
gulp.task('build', function() {
  gulp.start('buildHTML', 'buildCSS', 'buildJS', 'buildIMG');
});
gulp.task('rebuild', function() {
  gulp.start('buildHTML', 'buildCSS', 'buildJS', 'buildIMG');
});

// Start a node server
gulp.task('server', function(next) {
  gulpConnect.server({root: app.destinationPath});
});

gulp.task('addAndCommit', function() {
  gulpGit.add({args: '-a'});
  gulpGit.commit('build at ' + new Date().toString() );
});

gulp.task('push', function(next) {
  // gulpGit.push('origin', 'master')
     // .end();  // .end() is required
});

// Watch files
gulp.task('watch', ['server'], function() {

  // Watch for HTML CSS JS
  gulpWatch({ glob: app.paths.source.html }, function(){
    gulp.start('buildHTML');
  });
  gulpWatch({ glob: app.paths.source.css }, function(){
    gulp.start('buildCSS');
  });
  gulpWatch({ glob: app.paths.source.js }, function(){
    gulp.start('buildJS');
  });

  gulpWatch({ glob: app.sourcePath }, function(){
    gulp.start('addAndCommit');
  });
  

});

// Default task - build first then watch files and start server
gulp.task('default', ['build', 'watch']);
