(function(self) {
	self.map;
	var initLatCoord = 50.450946269314805;
	var initLngCoord = 30.598297119140625;
	var initZoom = 12;
	
	$el = function (el) {
		var elem = document.createElement(el);
		
		function _handleEvent(e) {
			var returnValue = true;
			
			e = e || _fixEvent(window.event);
			var handlers = elem.events[e.type];
			
			for (var i in handlers) {
				this.$$handleEvent = handlers[i];
				if (this.$$handleEvent(e) === false)
					returnValue = false;
			}
			
			return returnValue;
		}
		
		function _fixEvent(e) {
			e.preventDefault = _fixEvent.preventDefault;
			e.stopPropagation = _fixEvent.stopPropagation;
			
			return e;
		}
		
		_fixEvent.preventDefault = function() {
			this.returnValue = false;
		};
		
		_fixEvent.stopPropagation = function() {
			this.cancelBubble = true;
		};
		
		elem.setId = function(id) {
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
		
		elem.addEvent = function(type, handler) {
			if (!handler.$$guid)
				handler.$$guid = elem.addEvent.guid++;
				
			if (!elem.events)
				elem.events = {};
				
			var handlers = elem.events[type];
			if (!handlers) {
				handlers = elem.events[type] = {};
				
				if (elem['on' + type]) {
					handlers[0] = elem['on' + type];
				}
			}
			
			handlers[handler.$$guid] = handler;
			elem['on' + type] = _handleEvent;			
			
			return this;
		};
		
		elem.removeEvent = function(type, handler) {
			if (elem.events && elem.events[type]) {
				delete elem.events[type][handler.$$guid];
			}
		
			return this;
		};
		
		elem.addEvent.guid = 1;
		
		return elem;
	};
	
	self.pushMarkerToMap = function(coord) {
		var title = $el('p').text('Title: ').text(coord.title);
		var desc = $el('p').text('Description: ').text(coord.desc);
		var div = $el('div').append(title).append(desc);
		
		self.map.addOverlay(createMarker(new GLatLng(parseFloat(coord.lat), parseFloat(coord.lng)), div));
		self.map.closeInfoWindow();
	};
	
	var submitMarker = function() {
		var markerData = {
			lat: $('#lat').val(),
			lng: $('#lng').val(),
			title: $('#title').val(),
			desc: $('#desc').val()
		};
	
		$.ajax({
			type: 'POST',
			contentType: 'application/json',
			url: '/api/map', 
			dataType: 'json',
			data: JSON.stringify(markerData),
			success: function (data) {
				var json = $.parseJSON(data) || data;
				if (json.response && json.response.ok) {
					self.pushMarkerToMap(markerData);
				}
			}
		});
	
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
		var hiddenLat = $el('input').attr({value: lat, type: 'hidden', id: 'lat'});		
		var hiddenLng = $el('input').attr({value: lng, type: 'hidden', id: 'lng'});
		var label = $el('label').attr({htmlFor: 'title'}).text('Title:');			
		var title = $el('input').attr({type: 'text', id: 'title'});			
		var descLabel = $el('label').attr({htmlFor: 'desc'}).text('Description:');			
		var textarea = $el('textarea').setId('desc');			
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
	
	window.onload = function() {
		if (!GBrowserIsCompatible()) {
			document.getElementById('map').innnerHTML = 'Your browser doesn\'t support google maps';
			return;		
		};		
		
		self.map = new GMap(document.getElementById('map'));
		self.map.addControl(new GSmallMapControl());
		self.map.addControl(new GMapTypeControl());
		self.map.setCenter(new GLatLng(initLatCoord, initLngCoord), initZoom);
		
		GEvent.addListener(map, 'click', function(overlay, latlng) {
			if (latlng) {
				map.openInfoWindow(latlng, createMarkerForm(latlng.lat(), latlng.lng()));
				var form = document.getElementById('marker-form');
			}
		});		
		
		$.ajax({
			type: 'GET',
			url: '/api/map',
			cache: false,
			success: function (data) {
				var json = $.parseJSON(data) || data;			
				for (var i = 0; i < json.coords.length; i++) {
					self.pushMarkerToMap(json.coords[i]);
				}
			}
		});
	};

	window.onunload = GUnload;
})(window);