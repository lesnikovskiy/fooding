(function(self) {
	self.$el = function (el) {	
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
		
		elem.on = function(type, handler) {
			if (!handler.$$guid)
				handler.$$guid = elem.on.guid++;
				
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
		
		elem.on.guid = 1;
		
		elem.serialize = function() {
			var self = this;
			
			if (!self.elements && self.elements.length == 0)
				return '';
				
			var elems = [];
			for (var i = 0; i < self.elements.length; i++) {
				elems.push(self.elements[i].name + '=' + encodeURIComponent(self.elements[i].value));
			}
			
			return elems.join('&');
		};
		
		return elem;
	};
})(window);