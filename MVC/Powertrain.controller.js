sap.ui.controller("MVC.Powertrain", {

	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 * @memberOf MVC.Powertrain
	 */
	onInit: function() {

		var oMsg = new sap.ui.model.odata.ODataModel('/destinations/McCoy_URE/Powertrain.xsodata/');

		oMsg.setSizeLimit(10);
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

		var raceId = this.getView().byId("RaceIdLabel").getText();

		var aFilter = [];
		aFilter.push(new sap.ui.model.Filter("RACE_ID", sap.ui.model.FilterOperator.Contains, raceId));

		// filter binding
		var oList = this.getView().byId("Msg");
		var oBinding = oList.getBinding("items");
		var aSorter = new sap.ui.model.Sorter("TIMESTAMP", true);
		//oBinding.filter(aFilter);
		oBinding.sort(aSorter);

		var oMessages = this.getView().getModel("Msg");

		function refreshData() {
			oMessages.refresh();
		}

		setTimeout(function() {
			setInterval(function() {
				refreshData();
			}, 1000);
		}, 1000);
	}

	/**
	 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
	 * @memberOf MVC.Powertrain
	 */
	//	onExit: function() {
	//
	//	}
});