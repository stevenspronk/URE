jQuery.sap.declare("com.URE.Component");
sap.ui.core.UIComponent.extend("com.URE.Component", {
	metadata: {
		routing: {
			config: {
				viewType: "XML",
				viewPath: "MVC",
				targetControl: "navContainer",
				targetAggregation: "pages",
				clearTarget: false
			},
			routes: [{
				pattern: "",
				name: "CreateTest",
				view: "CreateTest"
			}, {
				pattern: "Overview/{id}",
				name: "Overview",
				view: "Overview"
			}]
		},
		config: {
			"serviceConfig": {
				"name": "UreRaceData.OData.UreOdataService",
				"serviceUrl": "/destinations/McCoy_URE/UreOdataService.xsodata/"
			},
			
			"messageService":{
				"name": "UreRaceData.OData.Messages",
				"serviceUrl": "/destinations/McCoy_URE/Messages.xsodata/"}
		}
	}
});
com.URE.Component.prototype.init = function() {
	jQuery.sap.require("sap.ui.core.routing.History");
	jQuery.sap.require("sap.m.routing.RouteMatchedHandler");
	sap.ui.core.UIComponent.prototype.init.apply(this);
	var router = this.getRouter();
	this.routeHandler = new sap.m.routing.RouteMatchedHandler(router);
	router.initialize();

	var oData = {
		RaceId: "UREtest"
	};
	var oModel = new sap.ui.model.json.JSONModel(oData);
	this.setModel(oModel, "RaceMetaData");
	
	     // Create a resource bundle for language specific texts
      var oResourceModel = new sap.ui.model.resource.ResourceModel({
        bundleName : "com.URE.model.i18n"
      });

      // Assign the model object to the SAPUI5 core using the name Messages"
      sap.ui.getCore().setModel(oResourceModel, "i18n");

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