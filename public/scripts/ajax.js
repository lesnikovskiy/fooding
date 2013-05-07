(function(self) {
	self.ajax = function (options) {
		options = {
			type: options.type || 'POST',
			url: options.url || '',
			timeout: options.timeout || 5000,
			complete: options.complete || function() {},
			error: options.error || function() {},
			success: options.success || function() {},
			progress: options.progress || function() {},
			cache: typeof options.cache != 'undefined' ? options.cache : true,
			contentType: options.contentType || 'text/html; charset=UTF-8',
			data: options.data || ''
		};		

		if (!options.cache) {			
			options.url = options.url.indexOf('?') >= 0 
				? options.url + '&' + (new Date()).getTime()
				: options.url + '?' + (new Date()).getTime()
		}
				
		if (typeof XMLHttpRequest == 'undefined') {
			XMLHttpRequest = function() {
				return new ActiveXObject(
					navigator.userAgent.indexOf('MSIE 5') >= 0
						? "Microsoft.XMLHTTP" : "Msxml2.XMLHTTP"
				);
			};
		}
		
		var xml = new XMLHttpRequest();	
		
		xml.open(options.type, options.url, true);
		
		var timeoutLength = options.timeout;
		var requestDone = false;
		
		setTimeout(function() {
			requestDone = true;
		}, timeoutLength);
		
		if (typeof xml.withCredentials == 'undefined') {
			xml.onreadystatechange = function() {
				if (xml.readyState == 4 && !requestDone) {
					if (isHTTPSuccess(xml)) {
						options.success(handleData(xml));
					} else {
						options.error();
					}
					
					options.complete();
					
					xml = null;
				}
			};	
		} else {
			xml.onload = function (e) {
				options.success(e.target.responseText);
			};
			xml.onerror = function (e) {
				options.error(e);
			};
			xml.onprogress = function (e) {
				var ratio = e.loaded / e.total;
				options.progress(ratio);
			};
		}
		
		if (!options.cache) {
			xml.setRequestHeader('Cache-Control', 'no-cache, no-store');
		}
		
		if (options.contentType)
			xml.setRequestHeader('Content-Type', options.contentType);
		
		if (xml.overrideMimeType)
			xml.setRequestHeader('Connection', 'close');
			
		xml.send(options.data);
		
		function isHTTPSuccess(r) {
			try {
				return !r.status && location.protocol == 'file:' || 
					(r.status >= 200 && r.status < 300) ||
					r.status == 304 ||
					navigator.userAgent.indexOf('Safari') >= 0
						&& typeof r.status == 'undefined'
			} catch (e) {}
			
			return false;
		}
		
		function handleData(r) {
			var ct = r.getResponseHeader('content-type');
			
			return !ct || ct.indexOf('xml') == -1 ? r.responseText : r.responseXML;
		}
	};
})(window);