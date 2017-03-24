jQuery.sap.require('sap.m.routing.RouteMatchedHandler');
jQuery.sap.require('sap.ui.core.routing.Router');

sap.ui.core.routing.Router.extend('iotmms.Router', {

	constructor : function() {
		sap.ui.core.routing.Router.apply(this, arguments);
		this._oRouteMatchedHandler = new sap.m.routing.RouteMatchedHandler(this);
	},
	
	destroy : function() {
		sap.ui.core.routing.Router.prototype.destroy.apply(this, arguments);
		this._oRouteMatchedHandler.destroy();
	},
	
	getApp : function() {
		return sap.ui.getCore().byId('iotmmsapp');
	},
	
	toPage : function(sName) {
		var bNoHistoryEntry = false;
		this.navTo(sName, {}, bNoHistoryEntry);
	},
	
	back : function() {
		window.history.go(-1);
	}

});