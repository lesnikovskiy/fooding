(function($) {
	$(document).ready(function() {
		/* Todo: invent something to migrate/create views
		$.post('/api/dev/notes/getnotesview', function(data) {
			alert(data);
		});*/
		function Note(note, isSync) {			
			this.id = ko.observable(note.id);
			this.rev = ko.observable(note.rev);
			this.title = ko.observable(note.title);
			this.body = ko.observable(note.body);
			this.isSync = ko.observable(isSync);
		}
		
		function NoteViewModel() {
			var self = this;
			self.notes = ko.observableArray([]);
			
			self.titleText = ko.observable();
			self.bodyText = ko.observable();
			
			self.addNote = function() {
				var note = new Note({title: self.titleText(), body: self.bodyText()}, false);				
				$.ajax({
					type: 'POST',
					url: '/api/notes',
					data: ko.toJS(note),
					success: function(data) {
						console.log(data);
						
						note.id(data.response.id);
						note.rev(data.response.rev);
						self.notes.push(note);
						self.resetForm();
					}
				});				
			};
			
			self.removeNote = function(note) {
				var note = note;
				$.ajax({
					type: 'DELETE',
					url: '/api/notes',
					data: ko.toJSON(note),
					contentType: 'application/json',
					success: function(data) {
						if (data.response && data.response.ok)
							self.notes.remove(note);
					}
				});
			};
			
			self.resetForm = function() {
				self.titleText('');
				self.bodyText('');
			};

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