(function() {
	var map;
	var initLatCoord = 50.450946269314805;
	var initLngCoord = 30.598297119140625;
	var initZoom = 12;
	
	$el = function (el) {
		var elem = document.createElement(el);
		
		elem.setid = function(id) {
			elem.id = id;
			return this;
		};
		
		elem.css = function(css) {
			for (var i in css) 
				elem.style[i] = css[i];
				
			return this;
		};
		
		elem.attr = function(attr) {
			for (var i in attr)
				elem[i] = attr[i];
				
			return this;
		};
		
		elem.text = function(txt) {
			elem.appendChild(document.createTextNode(txt));
			return this;
		}
		
		elem.encodeText = function(txt) {
			var textarea = document.createElement('textarea');
			textarea.innerHTML = txt;			
			elem.appendChild(document.createTextNode(textarea.innerHTML));
			
			return this;
		};
		
		elem.decodeText = function(txt) {
			var textarea = document.createElement('textarea');
			textarea.innerHTML = txt;
			elem.appendChild(document.createTextNode(textarea.value));
			return this;
		};
		
		elem.append = function(what) {
			(elem || document).appendChild(what);			
			return this;
		};
		
		elem.before = function(sibling) {
			sibling.parentNode.insertBefore(elem, sibling);
			return this;
		};
		
		elem.addEvent = function(event, callback) {
			elem['on' + event] = callback;
			return this;
		}
		
		return elem;
	};
	
	var submitMarker = function() {
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
		var Coord = function(coords) {
			debugger;
			this.id = ko.observable(coords.id);
			this.rev = ko.observable(coords.rev);
			this.lat = ko.observable(coords.lat);
			this.lng = ko.observable(coords.lng);
			this.title = ko.observable(coords.title);
			this.desc = ko.observable(coords.desc);
		};
		
		var CoordViewModel = function() {
			var self = this;
			
			self.lng = ko.observable();
			self.lat = ko.observable();
			self.title = ko.observable();
			self.desc = ko.observable();
			
			self.coords = ko.observableArray([]);
			self.addCoord = function() {
				var coord = new Coord({
					lng: self.lng(),
					lat: self.lat(),
					title: self.title(),
					desc: self.desc()
				});
				
				$.ajax({
					type: 'POST',
					url: '/api/map',
					data: ko.toJS(coord),
					success: function(data) {
						console.log(data);
					}
				});
				
				return false;
			};
		};
	
		var createMarkerForm = function(lat, lng) {
			var hiddenLat = $el('input').attr({value: lat, type: 'hidden', id: 'lat'});		
			var hiddenLng = $el('input').attr({value: lng, type: 'hidden', id: 'lng'});
			var label = $el('label').attr({htmlFor: 'title'}).text('Title:');			
			var title = $el('input').attr({type: 'text', id: 'title'});			
			var descLabel = $el('label').attr({htmlFor: 'desc'}).text('Description:');			
			var textarea = $el('textarea').setid('desc');			
			var submit = $el('input').attr({type: 'submit', value: 'submit', id: 'submit-marker'});
			
			var form = $el('form').attr({method: 'post', action: '/api/map', id: 'marker-form'})
							.addEvent('submit', submitMarker)
							.append(hiddenLat)
							.append(hiddenLng)
							.append(label)
							.append(title)
							.append(descLabel)
							.append(textarea)
							.append(submit);
			
			return form;
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
			if (latlng) {
				map.openInfoWindow(latlng, createMarkerForm(latlng.lat(), latlng.lng()));
				var form = document.getElementById('marker-form');
			}
		});
	};

	window.onunload = GUnload;
})(window);