/*global sap */
sap.ui.define(["JS/validator"], function(Validator) {
	"use strict";
	return sap.ui.controller("MVC.CreateTest", {
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf MVC.CreateTest
		 */
		onInit: function() {
			// Attaches validation handlers
			sap.ui.getCore().attachValidationError(function(oEvent) {
				oEvent.getParameter("element").setValueState(ValueState.Error);
			});
			sap.ui.getCore().attachValidationSuccess(function(oEvent) {
				oEvent.getParameter("element").setValueState(ValueState.None);
			});

			//First read the latest Race and Run ID from the backend.
			var oRaceMetaData = new sap.ui.model.odata.ODataModel("/destinations/McCoy_URE/UreMetadata.xsodata/", true);
			oRaceMetaData.oHeaders = {
				"DataServiceVersion": "3.0",
				"MaxDataServiceVersion": "3.0"
			};


			oRaceMetaData.read("/URE_METADATA?$orderby=RACE_ID%20desc&$top=1", null, null, false, function(oData, oResponse) {
				raceID = oData.results[0].RACE_ID + 1;
				runID = 1;
			});

			//Then, we create a new JSON model with the Race ID and Run ID filled in
			var metaJson = new sap.ui.model.json.JSONModel({
				"RACE_ID": raceID,
				"RUN_ID": runID,
				"CIRCUIT": null,
				"TEMPERATURE": null,
				"RACE_DESCRIPTION": null,
				"START_TIME": null,
				"END_TIME": null,
				"RACE_TYPE": null,
				"WEATHER": null,
				"NOTES": null,
				"CAR_ID": null,
				"CAR_NOTES": null,
				"NAME_DRIVER": null,
				"LENGTH_DRIVER": null,
				"WEIGHT_DRIVER": null,
				"DRIVER_NOTES": null
			});

			oRaceMetaData.oData[0] = metaJson.getData();

			this.getView().setModel(metaJson, "RaceMetaData");

			var oModel = new sap.ui.model.json.JSONModel({
				raceID: raceID,
				runID: runID
			});

			sap.ui.getCore().setModel(oRaceMetaData, "oRaceMetaData");
			sap.ui.getCore().setModel(oModel, "ID");
			sap.ui.getCore().setModel(metaJson, "RaceMetaData");

		},
		clearModel: function() {},
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
		onAfterRendering: function() {},
		/**
		 * Called when thse Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf MVC.CreateTest
		 */
		//	onExit: function() {
		//
		//	}

		clearEntries: function() {
			var data = sap.ui.getCore().getModel("RaceMetaData").getData();

			data = ({
				"RACE_ID": raceID,
				"RUN_ID": 1,
				"CIRCUIT": null,
				"TEMPERATURE": null,
				"RACE_DESCRIPTION": null,
				"START_TIME": new Date(),
				"END_TIME": null,
				"RACE_TYPE": null,
				"WEATHER": null,
				"NOTES": null,
				"CAR_ID": null,
				"CAR_NOTES": null,
				"NAME_DRIVER": null,
				"LENGTH_DRIVER": null,
				"WEIGHT_DRIVER": null,
				"DRIVER_NOTES": null
			});

			sap.ui.getCore().getModel("RaceMetaData").setData(data);
		},

		saveTest: function() {
			if (this.onValidate()) {
			    var me = this;
				var data = sap.ui.getCore().getModel("RaceMetaData").getData();
				var oRaceMetaData = sap.ui.getCore().getModel("oRaceMetaData");

				data.START_TIME = new Date();
				oRaceMetaData.oData[0] = data;

				oRaceMetaData.create("/URE_METADATA", data, null, function(oData, oResponse) {
						console.log(oResponse);
						me.goToOverview();
					},
					function(oError) {
						alert(oError.message);
					});
			};
		},
		// This function checks if a string is empty or not
		// If it's empty then it will return a NULL value.
		// This is required in order to post directly to a OData service.
		isEmpty: function(value) {
			if (value === "") {
				return null;
			} else {
				return value;
			}
		},
		goToOverview: function() {
			// Set variable crudTest to U.
			// This means that whenever an user goes back to the create view it will update
			// the already known race.
			crudTest = "U";
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Overview", {
				id: 1
			}, false);
		},
		onValidate: function() {
			// Create new validator instance
			var validator = new Validator();
			// Validate input fields against root page with id 'somePage'
			return validator.validate(this.byId("createTestView"));
		},
		/**
		 *@memberOf MVC.CreateTest
		 */
		goToHistory: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("History", { //Router navigation is done in manifest.json Code Editor
				id: 2
			}, false);
		}
	});
});