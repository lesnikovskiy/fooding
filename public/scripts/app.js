(function($) {
	$(document).ready(function() {
		/* Todo: invent something to migrate/create views */
		/*
		$.post('/api/dev/notes/getnotesview', function(data) {
			if (data.response && data.response.ok)
				alert('Notes View created successfully');
			else
				alert('Shit happens');
		});*/
		/* Create coords view for map databases
		$.post('/api/dev/map/createcoordsview', function(data) {
			if (data.response && data.response.ok)
				alert('Map View created successfully');
			else
				alert('Shit happens');
		});	*/
		
		function Note(note, isSync) {			
			this.id = ko.observable(note.id);
			this.rev = ko.observable(note.rev);
			this.title = ko.observable(note.title);
			this.body = ko.observable(note.body.replace(/\n/gi, '<br />'));
			this.isSync = ko.observable(isSync);
		}
		
		function NoteViewModel() {
			var self = this;
			self.notes = ko.observableArray([]);
			
			self.titleText = ko.observable();
			self.bodyText = ko.observable();
			
			self.addNote = function() {
				var note = new Note({title: self.titleText(), body: self.bodyText()}, false);
				
				ajax({
					type: 'POST',
					url: '/api/notes',
					contentType: 'application/json',
					data: ko.toJSON(note),
					success: function(data) {	
						var json = JSON.parse(data) || data;
						
						note.id(json.response.id);
						note.rev(json.response.rev);
						self.notes.push(note);
						self.resetForm();
					}
				});				
			};
			
			self.removeNote = function(note) {
				var note = note;
				ajax({
					type: 'DELETE',
					url: '/api/notes',
					data: ko.toJSON(note),
					contentType: 'application/json',
					success: function(data) {
						var json = JSON.parse(data) || data;
						
						if (json.response && json.response.ok)
							self.notes.remove(note);
					}
				});
			};
			
			self.resetForm = function() {
				self.titleText('');
				self.bodyText('');
			};
			
			$.ajaxSetup({ cache: false });
			$.getJSON('/api/notes', function(data) {
				var mappedNotes = $.map(data.notes, function(i) {
					return new Note(i, true);
				});
				self.notes(mappedNotes);
			});			
		}	
		
		ko.applyBindings(new NoteViewModel());
	});
})(jQuery);