/**
 * Hook the gulp-amphtml-validator to test our home page
 */
const { join } = require('path');
const gulp = require('gulp');
const fs = require('fs-extra');
const template = require('gulp-template');
const gulpAmpValidator = require('gulp-amphtml-validator');
// need to get the node-configs here
const config = require('config');
// @to1source add windoze compartible coding
const base = join(__dirname, '..');
/**
 * get the correct data to inject into the AMP page
 */
const getData = callback => {
  const paths = config.get('paths');
  const amp = config.get('amp');
  callback(Object.assign({
    css: fs.readFileSync(join(base, paths.dev, paths.style, 'main.css'), 'utf8')
  }, amp));
};

// Run validator
exports.ampValidator = (page) => {
  return () => {
    return gulp.src(page)
      // Validate the input and attach the validation result to the "amp" property
      // of the file object.
      .pipe(gulpAmpValidator.validate())
      // Print the validation results to the console.
      .pipe(gulpAmpValidator.format())
      // Exit the process with error code (1) if an AMP validation error
      // occurred.
      .pipe(gulpAmpValidator.failAfterError());
      // .pipe(gulpAmpValidator.failAfterWarningOrError());
  };
};

// Grab data then put content into the .amp.html using _.template method
exports.compileAmp = (pages, build) => {
  const paths = config.get('paths');
  const dir = build ? paths.dest : paths.dev;
  return done => {
    getData( props => {
      gulp.src(pages)
        .pipe(template(props))
        .pipe(gulp.dest(dir));
      done();
    });
  };
};
