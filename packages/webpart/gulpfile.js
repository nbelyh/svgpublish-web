'use strict';

const gulp = require('gulp');
const build = require('@microsoft/sp-build-web');

build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

gulp.task('update-version', function (cb) {

  const gutil = require('gulp-util');
  const fs = require('fs');

  var src = require('./package.json');
  var version = src.version.split('-')[0];

  gutil.log('Setting version to:\t' + version);

  var packageSolutionJson = require('./config/package-solution.json');
  packageSolutionJson.solution.version = version + '.0';
  fs.writeFileSync('./config/package-solution.json', JSON.stringify(packageSolutionJson, null, 2));

  var webPartManfiestJson = require('./src/WebPart/WebPart.manifest.json');
  webPartManfiestJson.version = version;
  fs.writeFileSync('./src/WebPart/WebPart.manifest.json', JSON.stringify(webPartManfiestJson, null, 2));

  cb();
});

build.tslintCmd.enabled = false;

var getTasks = build.rig.getTasks;
build.rig.getTasks = function () {
  var result = getTasks.call(build.rig);

  result.set('serve', result.get('serve-deprecated'));

  return result;
};

const eslint = require('gulp-eslint');
const eslintSubTask = build.subTask('eslint-subTask', function (gulp, buildOptions, done) {
  return gulp.src(['src/**/*.{ts,tsx}'])
    .pipe(eslint('./eslint.json'))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});
build.rig.addPreBuildTask(build.task('eslint', eslintSubTask));

let watchLevel = 0;
const watchCustomSubTask = build.subTask('watch-dependencies', function (gulp, buildOptions, done) {
  if (!watchLevel && buildOptions.args._[0] === 'serve') {
    ++watchLevel;

    // Watch for changes in svgpublish (directly from workspace)
    gulp.watch('../lib/**/*', (e) => {
      console.log('Lib changed, triggering reload...');
      return gulp.src('./src/index.ts')
        .pipe(gulp.dest('./src/'));
    });

    console.log('Watching for changes in dependencies...');
  }
  done();
});
let watchCustomTask = build.task('watchDependencies', watchCustomSubTask);
build.rig.addPostBuildTask(watchCustomTask);

build.initialize(gulp);

// Override clean task to also remove sharepoint folder
const originalClean = gulp.task('clean');
gulp.task('clean', gulp.series(
  originalClean,
  function cleanSharepoint(cb) {
    require('rimraf').sync('sharepoint');
    cb();
  }
));

build.mergeConfig({
  showToast: false
});
