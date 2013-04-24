(function() {
	var map;
	var initLatCoord = 50.450946269314805;
	var initLngCoord = 30.598297119140625;
	var initZoom = 12;
	
	var submitMarker = function() {
		debugger;
		var data = JSON.stringify({
				lat: $('#lat').val(),
				lng: $('#lng').val(),
				title: $('#title').val(),
				desc: $('#desc').val()
			});
	
		$.ajax({
			type: 'POST',
			contentType: 'application/json',
			url: '/api/map', 
			dataType: 'json',
			data: JSON.stringify({
				lat: $('#lat').val(),
				lng: $('#lng').val(),
				title: $('#title').val(),
				desc: $('#desc').val()
			}),
			success: function (data) {
				console.log(data);
			}
		});
	
		return false;
	};

	window.onload = function() {
		
	
		var createMarkerForm = function(lat, lng) {
			var html = '<form id="marker-form" onsubmit="return submitMarker();">';
			html += '<input type="hidden" value="' + lat + '" id="lat" />';
			html += '<input type="hidden" value="' + lng + '" id="lng" />';
			html += '<label for="title">Title:</label>'
			html += '<input type="text" id="title" />';
			html += '<label for="desc">Description:</label>'
			html += '<textarea id="desc"></textarea>';
			html += '<input type="submit" value="submit" id="submit-marker" />';
			html += '</form>';
			
			return html;
		};

		if (!GBrowserIsCompatible()) {
			document.getElementById('map').innnerHTML = 'Your browser doesn\'t support google maps';
			return;		
		};
		
		var map = new GMap(document.getElementById('map'));
		map.addControl(new GSmallMapControl());
		map.addControl(new GMapTypeControl());
		map.setCenter(new GLatLng(initLatCoord, initLngCoord), initZoom);
		
		GEvent.addListener(map, 'click', function(overlay, latlng) {
			if (latlng)
				map.openInfoWindow(latlng, createMarkerForm(latlng.lat(), latlng.lng()));
		});
	};

	window.onunload = GUnload;
})(window);