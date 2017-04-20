var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    csso = require('gulp-csso'),
    postcss = require('gulp-postcss'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs'),
    rename = require('gulp-rename'),
	del = require('del'),
    htmlmin = require('gulp-htmlmin'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer');

gulp.task('browser-sync', function() { // Создаем таск browser-sync
    browserSync({ // Выполняем browser Sync
        server: { // Определяем параметры сервера
            baseDir: 'bundles' // Директория для сервера - blocks
        },
        notify: false // Отключаем уведомления
    });
});

gulp.task('css', function(){ // Создаем таск Sass
	return gulp.src([
        'blocks/**/*.css',
        '!blocks/__**/*.css'
        ]) // Берем источник
        .pipe(postcss([
            require('postcss-import')(),
            require('postcss-each'),
            require('postcss-for'),
            require('postcss-simple-vars')(),
            require('postcss-calc')(),
            require('postcss-nested'),
            require('rebem-css'),
            require('postcss-url')({ url: 'inline' }),
            require('autoprefixer')(),
            require('postcss-reporter')()
        ]))
        .pipe(concat('style.min.css')) // Собираем их в кучу в новом файле style.min.css
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
        .pipe(gulp.dest('bundles')) // Выгружаем результата в папку app/css
		.pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
});

gulp.task('scripts', function() {
    return gulp.src([
        'node_modules/ym/modules.js',
        'blocks/**/*.js',
        '!blocks/__**/*.js'
        ]) // Берем все js из папки blocks
        .pipe(concat('scripts.min.js')) // Собираем их в кучу в новом файле scripts.min.js
        .pipe(gulp.dest('bundles')) // Выгружаем в папку bundles
        .pipe(browserSync.reload({stream: true})); // Обновляем JS на странице при изменении
});

gulp.task('images', function() {
    return gulp.src('blocks/**/*.+(jpg|jpeg|png|gif|svg)', { passthrough: true }) // Берем все изображения из blocks
        .pipe(cache(imagemin({  // Сжимаем их с наилучшими настройками с учетом кеширования
            optimizationLevel: 3,
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(rename(function(path) {
            path.dirname = '';
        }))
        .pipe(gulp.dest('bundles/img/')); // Выгружаем на продакшен
});

gulp.task('watch', ['browser-sync', 'scripts', 'images', 'css'], function() {
    gulp.watch('blocks/**/*.css', ['css']); // Наблюдение за sass файлами в папке css
	gulp.watch('blocks/**/*.js', ['scripts']);   // Наблюдение за JS файлами в папке blocks
	gulp.watch('bundles/*.html', browserSync.reload);   // Наблюдение за html файлами в папке bundles
});

gulp.task('clean', function() {
	return del.sync('dist'); // Удаляем папку dist перед сборкой
});

gulp.task('clear', function () {
    return cache.clearAll();
})

gulp.task('build', ['clean', 'scripts'], function() {

	var buildCss = gulp.src([ // Переносим библиотеки в продакшен
		'bundles/*.css'
		])
    .pipe(csso())
	.pipe(gulp.dest('dist'))

	var buildJs = gulp.src('bundles/*.js') // Переносим скрипты в продакшен
    .pipe(uglify()) // Сжимаем JS файл
	.pipe(gulp.dest('dist'))

	var buildHtml = gulp.src('bundles/*.html') // Переносим HTML в продакшен
    .pipe(htmlmin({collapseWhitespace: true}))
	.pipe(gulp.dest('dist'));

});

gulp.task('default', ['watch']);
