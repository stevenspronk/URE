jQuery.sap.declare("com.URE.Component");
sap.ui.core.UIComponent.extend("com.URE.Component", {
	  metadata : {
            manifest: "json"
      }
});
com.URE.Component.prototype.init = function() {
	jQuery.sap.require("sap.ui.core.routing.History");
	jQuery.sap.require("sap.m.routing.RouteMatchedHandler");
	sap.ui.core.UIComponent.prototype.init.apply(this);

	this.getRouter().initialize();


};

com.URE.Component.prototype.destroy = function() {
	if (this.routeHandler) {
		this.routeHandler.destroy();
	}
	sap.ui.core.UIComponent.destroy.apply(this, arguments);
};
com.URE.Component.prototype.createContent = function() {
	this.view = sap.ui.view({
		id: "app",
		viewName: "MVC.App",
		type: sap.ui.core.mvc.ViewType.JS
	});
	return this.view;
};