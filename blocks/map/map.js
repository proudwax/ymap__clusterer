modules.define('map', ['ymaps', 'jquery'], function(provide, ymaps, jQuery) {

    provide(
        function (dataPath, blockID, ymapsOptions) {
            $ = jQuery;

            var myMap = new ymaps.Map(blockID, ymapsOptions, {
                    searchControlProvider: 'yandex#search'
                }),
                objectManager = new ymaps.ObjectManager({
                    // Чтобы метки начали кластеризоваться, выставляем опцию.
                    clusterize: true,
                    // ObjectManager принимает те же опции, что и кластеризатор.
                    gridSize: 32
                });

            // Отменяет зум скроллом
            myMap.behaviors.disable('scrollZoom');

            // Чтобы задать опции одиночным объектам и кластерам,
            // обратимся к дочерним коллекциям ObjectManager.
            objectManager.objects.options.set('preset', 'islands#redDotIcon');
            objectManager.clusters.options.set('preset', 'islands#redClusterIcons');
            myMap.geoObjects.add(objectManager);

            $.ajax({
                url: dataPath
            }).done(function(data) {
                data.features.map(function (item) {
                    item.properties.balloonContent = item.properties.balloonContent + '<br>' + item.geometry.adress;
                });

                objectManager.add(data);
            });
        }
    );
    
});

modules.require('map', function(map) {
    map('data.json', 'YMapsID', {  center: [52.76, 42.64], zoom: 5.3 });
});
