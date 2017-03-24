(function(root) {

	var Channel = function() {
		throw new Error('Channel is an enumeration!');
	};

	Channel.prototype = {};

	Channel.APP = 'iotmmsapp';

	root.Channel = Channel;

})(this);