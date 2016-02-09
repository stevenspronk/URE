sap.ui.controller("MVC.Dashboard", {

	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 * @memberOf MVC.Dashboard
	 */
	onInit: function() {
		
		var oConfig = this.getOwnerComponent().getMetadata().getConfig();
		var oModel = new sap.ui.model.odata.ODataModel(oConfig.serviceConfig.serviceUrl);
		//	this.getOwnerComponent().setModel(oModel, "URE");
		this.getView().setModel(oModel,"ComponentTest");
	},

	/**
	 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
	 * (NOT before the first rendering! onInit() is used for that one!).
	 * @memberOf MVC.Dashboard
	 */
	//	onBeforeRendering: function() {
	//
	//	},

	/**
	 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 * @memberOf MVC.Dashboard
	 */
	onAfterRendering: function() {
	/*var oConfig = this.getOwnerComponent().getMetadata().getConfig();
		var oModel = new sap.ui.model.odata.ODataModel(oConfig.serviceConfig.serviceUrl);
		//	this.getOwnerComponent().setModel(oModel, "URE");
		this.getView().setModel(oModel, "URE");
		
	
		oTest.setModel(oModel);
		
		var aData = oModel.getProperty("/d/results");
		console.log(aData);
		oTest.bindProperty("title", "VEHICLE_SPEED");
oTest.bindElement("ZURE_ALL");*/

	
		
	},

	/**
	 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
	 * @memberOf MVC.Dashboard
	 */
	//	onExit: function() {
	//
	//	}
	goToCreateTest: function() {
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		router.navTo("CreateTest", null, false);
	}
});