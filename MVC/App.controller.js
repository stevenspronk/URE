var crudTest = 'C'; // Create, Read, Update, Delete a test. Default C = Create
var raceID;

sap.ui.controller("MVC.App", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf MVC.App
*/
	onInit: function() {
		
		// Create an oData model for the messages from the powertrain
		var oMsg = new sap.ui.model.odata.ODataModel('/destinations/McCoy_URE/Powertrain.xsodata/');
		//oMsg.setSizeLimit(20);
		sap.ui.getCore().setModel(oMsg, "Msg");

	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf MVC.App
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf MVC.App
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf MVC.App
*/
//	onExit: function() {
//
//	}

 refreshMessages: function(){
	var oMsg = sap.ui.getCore().getModel("Msg");

		function refreshData() {
			oMsg.refresh();
		}

		setTimeout(function() {
			setInterval(function() {
				refreshData();
			}, 1000);
		}, 1000);
}

});