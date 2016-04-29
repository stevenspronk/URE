/*global sap */
sap.ui.define(["JS/validator"], function(Validator) {
	"use strict";
	return sap.ui.controller("MVC.CreateTest", {

		setDefaults: function() {
			var RaceMetaData = sap.ui.getCore().getModel("RaceMetaData");
			var data = RaceMetaData.getData();
			data.CIRCUIT = 'Hockenheim';
			data.TEMPERATURE = 25;
			data.RACE_DESCRIPTION = 'Test';
			data.RACE_TYPE = 'Endurance';
			data.WEATHER = "Zonnig";
			data.CAR_ID = "URE11";
			data.NAME_DRIVER = "The Stig";
			data.LENGTH_DRIVER = 201;
			data.WEIGHT_DRIVER = 87;
			RaceMetaData.setData(data);
		},

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
			oRaceMetaData.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);

			var pathLastRace = "/URE_METADATA?$orderby=RACE_ID%20desc&$top=1";
			oRaceMetaData.read(pathLastRace, null, null, false, function(oData, oResponse) {
					raceID = oData.results[0].RACE_ID + 1;
					runID = 1;
				},
				function(oError) {
					sap.m.MessageToast.show(oError.message);
				}
			);

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

			var oContext = oRaceMetaData.createEntry("/URE_METADATA", metaJson.getData());
			//var path = oContext.getPath();

			this.getView().setModel(metaJson, "RaceMetaData");
			// 			this.getView().setModel(oRaceMetaData, "RaceMetaData");
			// 			this.getView().byId("metaform").bindContext(path);
			// 			oRaceMetaData.updateBindings();

			var oModel = new sap.ui.model.json.JSONModel({
				raceID: raceID,
				runID: runID
			});

			sap.ui.getCore().setModel(oRaceMetaData, "oRaceMetaData");
			sap.ui.getCore().setModel(oModel, "ID");
			sap.ui.getCore().setModel(metaJson, "RaceMetaData");

		},
		clearModel: function() {},

		onAfterRendering: function() {},

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
				var oId = sap.ui.getCore().getModel("ID");
				var data = sap.ui.getCore().getModel("RaceMetaData").getData();
				var oRaceMetaData = sap.ui.getCore().getModel("oRaceMetaData");

				oId.oData.raceID = data.RACE_ID;
				oId.oData.runID = data.RUN_ID;
				oId.updateBindings();

				raceID = oId.oData.raceID;
				runID = oId.oData.runID;

				data.START_TIME = new Date();

				oRaceMetaData.submitChanges(function(oData, oResponse) {
						console.log(oResponse);
						me.goToOverview();
					},
					function(oError) {
						console.log(oError.message);
					});

			}
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
		    crudTest = "R";
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("History", { //Router navigation is done in manifest.json Code Editor
				id: 1
			}, false);
		}
	});
});