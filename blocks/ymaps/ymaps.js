modules.define('ymaps', ['loader'], function(provide, loader) {
    loader('https://api-maps.yandex.ru/2.1/?load=package.full&lang=ru_RU', function() {
        ymaps.ready(function() {
            provide(ymaps);
        });
    });
});
