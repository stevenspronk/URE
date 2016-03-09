sap.ui.controller("MVC.CreateTest", {

	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 * @memberOf MVC.CreateTest
	 */
	onInit: function() {

		//RaceMetaData model
		var oRaceMetaData = new sap.ui.model.odata.v2.ODataModel(
			"/destinations/McCoy_URE/UreMetadata.xsodata/",
			{defaultBindingMode:"TwoWay", refreshAfterChange:true});


		var testView = this.getView();
		this.getView().setModel(oRaceMetaData, "RaceMetaData");

		oRaceMetaData.attachMetadataLoaded(null, function() {

			var raceContext = oRaceMetaData.createEntry("URE_METADATA", {
				CAR_ID: "URE10",
				CAR_NOTES: "nothing",
				CIRCUIT: "",
				DRIVER_NOTES: "",
				END_TIME: new Date().getTime(),
				LENGTH_DRIVER: "",
				NAME_DRIVER: "",
				NOTES: "",
				RACE_ID: "Test",
				RACE_TYPE: "",
				START_TIME: new Date().getTime(),
				TEMPERATURE: "",
				WEATHER: "",
				WEIGHT_DRIVER: ""
			});

			testView.byId("Input_Race_Id").setBindingContext(raceContext, [oRaceMetaData]);

		}, null);

	},

	/**
	 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
	 * (NOT before the first rendering! onInit() is used for that one!).
	 * @memberOf MVC.CreateTest
	 */
	//	onBeforeRendering: function() {
	//
	//	},

	/**
	 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 * @memberOf MVC.CreateTest
	 */
	//	onAfterRendering: function() {
	//
	//	},

	/**
	 * Called when thse Controller is destroyed. Use this one to free resources and finalize activities.
	 * @memberOf MVC.CreateTest
	 */
	//	onExit: function() {
	//
	//	}

	startTest: function() {
		//First store entry in metadata table
		var timestamp = new Date().getTime();
		var oRaceMetaData = this.getView().getModel("RaceMetaData");

		oRaceMetaData.submitChanges();
		//Then, navigate to overview
		this.goToOverview();
	},

	goToOverview: function() {

		var router = sap.ui.core.UIComponent.getRouterFor(this);
		router.navTo("Overview", {
			id: 1
		}, false);
	}

});