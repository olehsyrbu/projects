const browserify = require('browserify'),
    gulp = require('gulp'),
    sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    cleanCSS = require('gulp-clean-css'),
    minify = require('gulp-minify'),
    browserSync = require('browser-sync');

/* pathConfig*/
const entryPoint = './src/js/app.js',
    browserDir = './build/',
    sassWatchPath = './src/sass/**/*.scss',
    jsWatchPath = './src/js/**/*.js',
    htmlWatchPath = './**/*.html';
/**/

gulp.task('js', function () {
    return browserify(entryPoint, {debug: true, extensions: ['es6']})
        .transform("babelify", {presets: ["env"]})
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write())
        .pipe(minify({
            ext:{
                src:'.js',
                min:'.min.js'
            },
            exclude: ['tasks'],
            ignoreFiles: ['.combo.js', '-min.js']
        }))
        .pipe(gulp.dest('./build/js'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('browser-sync', function () {
    const config = {
        server: {baseDir: browserDir}
    };

    return browserSync(config);
});

gulp.task('sass', function () {
    return gulp.src(sassWatchPath)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(cleanCSS({compatibility: 'ie10'}))
        .pipe(gulp.dest('./build/css'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('watch', function () {
    gulp.watch(jsWatchPath, ['js']);
    gulp.watch(sassWatchPath, ['sass']);
    gulp.watch(htmlWatchPath, function () {
        return gulp.src('')
            .pipe(browserSync.reload({stream: true}));
    });
});

gulp.task('run', ['js', 'sass', 'watch', 'browser-sync']);