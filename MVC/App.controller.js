var crudTest = 'C'; // Create, Read, Update, Delete a test. Default C = Create
var raceID;
var runID;

sap.ui.controller("MVC.App", {

	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 * @memberOf MVC.App
	 */
	onInit: function() {
		// Create all data models and bind them to the core
		// These can be retreived in each view
	//	var oEventBus = sap.ui.getCore().getEventBus();
	//	oEventBus.subscribe("ViewMode", "showHideButtons", this.handleButtons, this);
	}

// 	handleButtons: function() {
// 	    debugger;
	    
// 		if (crudTest === "R") {
// 			this.getView().byId("_newTestBtn").setVisible(false);
// 			this.getView().byId("_newRunBtn").setVisible(false);
// 			this.getView().byId("_appView").setShowNavButton(true);
// 		}

// 		if (crudTest === "C") {
// 			this.getView().byId("_newTestBtn").setVisible(true);
// 			this.getView().byId("_newRunBtn").setVisible(true);
// 			this.getView().byId("_appView").setShowNavButton(false);
// 		}

// 		if (crudTest === "U") {
// 			this.oView.byId("_newTestBtn").setVisible(true);
// 			this.oView.byId("_newRunBtn").setVisible(true);
// 			this.oView.byId("_appView").setShowNavButton(false);
// 		}
// 	}

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
	/*	onAfterRendering: function() {
			// The app should refresh the data continuesly, but not all models, only the models of the active tab
			var me = this;

			setTimeout(function() {
				setInterval(function() {
					var oSelection = sap.ui.getCore().getModel("Selection");
					var key = oSelection.oData.selectedView;

					me.refreshData(key);
				}, 1000);
			}, 1000);

		},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf MVC.App
		 */
	//	onExit: function() {
	//
	//	}

	/*	refreshData: function(key) {
			switch (key) {
				case "Powertrain":
					var oMsg = sap.ui.getCore().getModel("Msg");
					oMsg.refresh();
					break;
				case "Dashboard":

					break;
				case "Car":

					break;
				case "Driver":

					break;
			}
		}*/

});