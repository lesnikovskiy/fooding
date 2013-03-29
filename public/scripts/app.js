(function($) {
	$(document).ready(function() {
		/*
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
			self.addNote = function(note) {
				self.notes.push(new Note({title: self.titleText(), body: self.bodyText()}, false));
				console.log(ko.toJSON(self.notes));
				
				$.ajax({
					type: 'POST',
					url: '/api/notes',
					data: ko.toJSON(self.notes),
					success: function(data) {
						console.log(data);
						$.getJSON('/api/notes', function(data) {
							var mappedNotes = $.map(data.notes, function(i) {
								return new Note(i, true);
							});
							self.notes(mappedNotes);
						});
					}
				});				
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