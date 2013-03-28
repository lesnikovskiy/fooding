(function($) {
	$(document).ready(function() {
		/*
		$.post('/api/dev/notes/getnotesview', function(data) {
			alert(data);
		});*/
		function Note(note) {			
			this.id = ko.observable(note.id);
			this.rev = ko.observable(note.rev);
			this.title = ko.observable(note.title);
			this.body = ko.observable(note.body);
		}
		
		function NoteViewModel() {
			var self = this;
			self.notes = ko.observableArray([]);
			self.addNote = function(note) {
				$.ajax({
					type: 'POST',
					url: '/api/notes',
					data: ko.toJSON(note),
					success: function(data) {
						console.log(data);
					}
				});				
			};

			$.getJSON('/api/notes', function(data) {
				var mappedNotes = $.map(data.notes, function(i) {
					return new Note(i);
				});
				self.notes(mappedNotes);
			});			
		}	
		
		ko.applyBindings(new NoteViewModel());
	});
})(jQuery);