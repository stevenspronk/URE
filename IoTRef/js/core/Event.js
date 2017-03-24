(function( root ) {

	var Event = function() {
		throw new Error( 'Event is an enumeration!' );
	};

	Event.prototype = {};

	Event.BEFORE_AJAX = 'iotmmsbeforeajax';
	Event.AFTER_AJAX = 'iotmmsafterajax';
	Event.CONSOLE_PRINT = 'iotmmsconsoleprint';
	Event.SAVE_PROCESSING_SERVICE_MAPPING = 'saveProcessingServiceMapping';
	Event.ADD_PROCESSING_SERVICE = 'addProcessingService';
	Event.REMOVE_PROCESSING_SERVICE = 'removeProcessingService';

	root.Event = Event;

})( this );