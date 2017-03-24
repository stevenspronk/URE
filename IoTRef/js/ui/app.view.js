sap.ui.jsview('js.ui.app', {

	getControllerName : function() {
		return 'js.ui.app';
	},

	createContent : function(oController) {
		this.setDisplayBlock(true);
		return new sap.m.App('iotmmsapp');
	}

});