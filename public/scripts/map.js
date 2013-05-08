(function(self) {
	self.map;
	var initLatCoord = 50.450946269314805;
	var initLngCoord = 30.598297119140625;
	var initZoom = 12;		
	
	self.pushMarkerToMap = function(coord) {
		var title = $el('p').text('Title: ').text(coord.title);
		var desc = $el('p').text('Description: ').text(coord.desc);
		var div = $el('div').append(title).append(desc);
		
		self.map.addOverlay(createMarker(new GLatLng(parseFloat(coord.lat), parseFloat(coord.lng)), div));
		self.map.closeInfoWindow();
	};

	// Go with websocket
	var wsSupport = false;
	
	if (typeof WebSocket != 'undefined') {
		var ws = new WebSocket('ws://localhost:3000', 'echo-protocol');
		ws.onopen = function() {
			console.log('Connection established');
			wsSupport = true;
		};
		ws.onmessage = function (e) {
			if (!e.data)
				return;

			var res = JSON.parse(e.data);
			switch(res.act) {
				case 'get':
					for (var k = 0; k < res.coords.length; k++) {
						self.pushMarkerToMap(res.coords[k]);
					}
					break;
				case 'post':
					if (res.coord)
						self.pushMarkerToMap(res.coord);
					break;
			}
		};
		ws.onclose = function (e) {
			console.log('Connection closed');
		};
		ws.onerror = function (e) {
			console.log('Error occurred');
		};
	}
	
	var submitMarker = function() {
		var ctx = this;
		
		var markerData = {
			lat: document.getElementById('lat').value,
			lng: document.getElementById('lng').value,
			title: document.getElementById('title').value,
			desc: document.getElementById('desc').value
		};

		if (!wsSupport) {				
			ajax({
				type: ctx.method,
				url: ctx.action,
				data: ctx.serialize(),	
				contentType: 'application/x-www-form-urlencoded',
				success: function (data) {
					var json = JSON.parse(data) || data;
					if (json.response && json.response.ok) {
						self.pushMarkerToMap(markerData);
					}
				},
				error: function () {
					console.log(arguments);
				},
				progress: function(e) {
					console.log(e);
				}
			});
		} else {
			markerData.act = 'post';
			ws.send(JSON.stringify(markerData));
		}
	
		return false;
	};
	
	var createMarker = function (latlng, html) {
		var marker = new GMarker(latlng);
		GEvent.addListener(marker, 'click', function() {
			marker.openInfoWindowHtml(html);
		});
		
		return marker;
	};	
	
	var createMarkerForm = function(lat, lng) {
		var hiddenLat = $el('input').attr({value: lat, type: 'hidden', id: 'lat', name: 'lat'});		
		var hiddenLng = $el('input').attr({value: lng, type: 'hidden', id: 'lng', name: 'lng'});
		var label = $el('label').attr({htmlFor: 'title'}).text('Title:');			
		var title = $el('input').attr({type: 'text', id: 'title', name: 'title'});			
		var descLabel = $el('label').attr({htmlFor: 'desc'}).text('Description:');			
		var textarea = $el('textarea').attr({id: 'desc', name: 'desc'});			
		var submit = $el('input').attr({type: 'submit', value: 'submit', id: 'submit-marker', name: 'submit-button'});
		
		var form = $el('form').attr({method: 'post', action: '/api/map', id: 'marker-form'})
						.on('submit', submitMarker)
						.append(hiddenLat)
						.append(hiddenLng)
						.append(label)
						.append(title)
						.append(descLabel)
						.append(textarea)
						.append(submit);
		
		return form;
	};
	
	window.onload = function() {
		if (!GBrowserIsCompatible()) {
			document.getElementById('map').innnerHTML = 'Your browser doesn\'t support google maps';
			return;		
		};		
		
		self.map = new GMap(document.getElementById('map'));
		self.map.addControl(new GSmallMapControl());
		self.map.addControl(new GMapTypeControl());
		self.map.setCenter(new GLatLng(initLatCoord, initLngCoord), initZoom);
		
		GEvent.addListener(map, 'singlerightclick', function(point, elem, overlay) {
			console.log(point);
			console.log(elem);
			console.log(overlay);
			if (point) {
				
			}
		});
		
		GEvent.addListener(map, 'click', function(overlay, latlng) {
			if (latlng) {
				map.openInfoWindow(latlng, createMarkerForm(latlng.lat(), latlng.lng()));
				var form = document.getElementById('marker-form');
			}
		});		
		
		if (!wsSupport) {
			ajax({
				type: 'GET',
				url: '/api/map',
				cache: false,
				success: function (data) {
					var json = JSON.parse(data) || data;
					for (var i = 0; i < json.coords.length; i++) {
						self.pushMarkerToMap(json.coords[i]);
					}
				}
			});
		} else {
			ws.send(JSON.stringify({act: 'get'}));		
		}
	};

	window.onunload = GUnload;
})(window);