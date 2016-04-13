var activeView;

sap.ui.controller("MVC.Overview", {

	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 * @memberOf MVC.Overview
	 */
	onInit: function() {
		this.router = sap.ui.core.UIComponent.getRouterFor(this);
		this.router.attachRoutePatternMatched(this._handleRouteMatched, this);

		//Create a model to store in which tab we are (filled from the Overview.controller.js)
		//We fill it initially with the Dashboard view
		var oSelection = new sap.ui.model.json.JSONModel({
			selectedView: "Dashboard"
		});
		sap.ui.getCore().setModel(oSelection, "Selection");

	},

	onSelect: function(oEvent) {
		var key = oEvent.getParameters().key;
		var oSelection = sap.ui.getCore().getModel("Selection");
		oSelection.oData.selectedView = key;
	},

	_handleRouteMatched: function(evt) {
		if ("Overview" !== evt.getParameter("name")) {
			return;
		}
		var id = evt.getParameter("arguments").id;
		var model = new sap.ui.model.json.JSONModel({
			id: id
		});
		this.getView().setModel(model, "data");
	},

	/**
	 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
	 * (NOT before the first rendering! onInit() is used for that one!).
	 * @memberOf MVC.Overview
	 */
	//	onBeforeRendering: function() {
	//
	//	},

	/**
	 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 * @memberOf MVC.Overview
	 */
	onAfterRendering: function() {
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

	refreshData: function(key) {
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
	},

	/**
	 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
	 * @memberOf MVC.Overview
	 */
	//	onExit: function() {
	//
	//	}
	onNavBack: function() {

		window.history.go(-1);
	},

	navButtonTap: function() {
		window.history.go(-1);
	},

	newTest: function() {
		var oRaceMetaData = new sap.ui.model.odata.ODataModel("/destinations/McCoy_URE/UreMetadata.xsodata/");
		//var oRaceModel = sap.ui.getCore().byId;

		var sPath = "/URE_METADATA(RACE_ID=" + raceID + ",RUN_ID=" + runID + ")";

		//oRaceMetaData.getData(sPath);

		oRaceMetaData.read(sPath, function() {
			console.log("update succeeded");
		}, function() {
			console.log("update failed");
		});

		debugger;
		
		// Set END_TIME
		var data = {
			"RACE_ID": raceID,
			"RUN_ID": runID,
			"CIRCUIT": oRaceMetaData.CIRCUIT,
			"TEMPERATURE": oRaceMetaData.TEMPERATURE,
			"RACE_DESCRIPTION": oRaceMetaData.RACE_DESCRIPTION,
			"START_TIME": oRaceMetaData.START_TIME,
			"END_TIME": new Date(),
			"RACE_TYPE": oRaceMetaData.RACE_TYPE,
			"WEATHER": oRaceMetaData.WEATHER,
			"NOTES": oRaceMetaData.NOTES,
			"CAR_ID": oRaceMetaData.CAR_ID,
			"CAR_NOTES": oRaceMetaData.CAR_NOTES,
			"NAME_DRIVER": oRaceMetaData.NAME_DRIVER,
			"LENGTH_DRIVER": oRaceMetaData.LENGTH_DRIVER,
			"WEIGHT_DRIVER": oRaceMetaData.WEIGHT_DRIVER,
			"DRIVER_NOTES": oRaceMetaData.DRIVER_NOTES
		};

		oRaceMetaData.update(sPath, data, function() {
			console.log("update succeeded");
		}, function() {
			console.log("update failed");
		});

		var router = sap.ui.core.UIComponent.getRouterFor(this);
		router.navTo("CreateTest", {
			id: 1
		}, false);

		// Set variable crudTest to C = Create		
		crudTest = 'C';

		sap.m.MessageToast.show("Test gestopt en opgeslagen");
	}
});