sap.ui.controller("MVC.Powertrain", {

	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 * @memberOf MVC.Powertrain
	 */
	onInit: function() {

		// Create an oData model for the messages from the powertrain
		var oMsg = new sap.ui.model.odata.ODataModel('/destinations/McCoy_URE/Powertrain.xsodata/');
		oMsg.setSizeLimit(20);
		sap.ui.getCore().setModel(oMsg, "Msg");
		this.getView().setModel(oMsg, "Msg");
	},
	// 
	/**
	 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
	 * (NOT before the first rendering! onInit() is used for that one!).
	 * @memberOf MVC.Powertrain
	 */
	//	onBeforeRendering: function() {
	//
	//	},

	/**
	 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 * @memberOf MVC.Powertrain
	 */
	onAfterRendering: function() {
		var oId = sap.ui.getCore().getModel("ID");
		var raceID = oId.oData.raceID;
		var runID = oId.oData.runID;

		var aFilter = [];
		aFilter.push(new sap.ui.model.Filter("RACE_ID", sap.ui.model.FilterOperator.EQ, raceID));
		aFilter.push(new sap.ui.model.Filter("RUN_ID", sap.ui.model.FilterOperator.EQ, runID));

		// filter binding
		var oList = this.getView().byId("Msg");
		var oBinding = oList.getBinding("items");
		var aSorter = new sap.ui.model.Sorter("MSG_TIMESTAMP", true);
		oBinding.filter(aFilter);
		oBinding.sort(aSorter);

	}

	/**
	 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
	 * @memberOf MVC.Powertrain
	 */
	//	onExit: function() {
	//
	//	}
});