ymaps.ready(init);
var myMap;

function init(){ 
    myMap = new ymaps.Map ("map", {
        center: [55.15, 61.39],
        zoom: 12
    }); 

    myMap.controls.remove('typeSelector');
	myMap.controls.remove('scaleLine');
    myMap.controls.remove('searchControl');
    myMap.controls.remove('trafficControl');
    myMap.controls.remove('zoomControl');
    myMap.controls.remove('geolocationControl');

    //myMap.controls.add('zoomControl', { top: 5, left: 5 });

    // Добавим свой элемент в контейнер элементов управления карты
//	$('<div><input type="button" value="Click!"/></div>')
//    	.css({ position: 'absolute', left: '5px', top: '50px'})
//    	.appendTo(map.panes.get('controls').getElement());

    // Геокоординаты области, которой мы хотим ограничить просмотр карты
	var bounds = [[54.2, 61.1], [56, 61.7]];
	// Запретим пользователю подыматься на уровни масштабирования меньше 11
	myMap.options.set('minZoom', 12);
	// Будем слушать изменение области показа карты и плавно возвращать
	// пользователя обратно в пределы заданной области.
	myMap.events.add('boundschange', function (e) {
        // Новая область показа карты
        var newBounds = e.get('newBounds'),
        // Считаем, насколько нужно сместить центр карты, чтобы
        // вернуть пользователя обратно в заданные границы
        offset = [
         	bounds[0][0] > newBounds[0][0] ?
            	bounds[0][0] - newBounds[0][0] :
            	   (bounds[1][0] < newBounds[1][0] ? bounds[1][0] - newBounds[1][0] : 0),
    	   bounds[0][1] > newBounds[0][1] ?
	           bounds[0][1] - newBounds[0][1] :
                    (bounds[1][1] < newBounds[1][1] ? bounds[1][1] - newBounds[1][1] : 0)
        ];
     	// Если пользователь вышел за границы, возвращаем его обратно
     	if (offset[0] || offset[1]) {
        	myMap.setCenter([
        		myMap.getCenter()[0] + offset[0],
             	myMap.getCenter()[1] + offset[1]
         	]);
		}
	});;

    //ставит балун на карту
	myPlacemark = new ymaps.Placemark([55.178519, 61.321861], {
	    balloonContentBody: [
	        '<address>',
	        '<strong>Red Cup</strong>',
	        '<br/>',
	        'Адрес: Челябинск, ул. Братьев кашириных, 16',
	        '<br/>',
	        'Подробнее: <a href="https://company.yandex.ru/">https://company.yandex.ru</a>',
	        '</address>'
        ].join('')
	}, {
		preset: 'islands#twirl#cafeIcon'
    });
    myMap.geoObjects.add(myPlacemark);

	//центрирует карту на myPlacemark при его нажатии
	myPlacemark.events.add('click',function (){
		myMap.setCenter(myPlacemark.geometry.getCoordinates(),16);
	});

    var myGeolocation;
    //определение местоположения с помощью средств браузера
    ymaps.geolocation.get({
        provider: 'auto',
        mapStateAutoApply: true
    }).then(function (result) {
        // Синим цветом пометим положение, полученное через браузер.
        // Если браузер не поддерживает эту функциональность, метка не будет добавлена на карту.
        result.geoObjects.options.set('preset', 'islands#blueCircleIcon');
        myGeolocation = result.geoObjects;
        myMap.geoObjects.add(result.geoObjects);
    });

    //Проклабывает маршрут между точками
    ymaps.route([myPlacemark.geometry.getCoordinates(),myGeolocation.geometry.getCoordinates()]).done(function (route) {
        route.options.set("mapStateAutoApply", true);
        myMap.geoObjects.add(route);
    }, function (err) {
        throw err;
    }, this);

    myMap.geoObjects.add(myPlacemark);
}