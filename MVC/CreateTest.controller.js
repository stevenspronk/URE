/*global sap */
sap.ui.define(["JS/validator", "sap/ui/model/odata/v2/ODataModel"], function(Validator, ODataModel) {
	"use strict";
	return sap.ui.controller("MVC.CreateTest", {

		setDefaults: function() {
			var oRaceMetaData = this.getView().getModel();
			var oPath = this.getView().getBindingContext().getPath();

			oRaceMetaData.setProperty(oPath + "/CIRCUIT", 'Hockenheim');
			oRaceMetaData.setProperty(oPath + "/TEMPERATURE", 25);
			oRaceMetaData.setProperty(oPath + "/RACE_DESCRIPTION", 'Test');
			oRaceMetaData.setProperty(oPath + "/RACE_TYPE", "Endurance");
			oRaceMetaData.setProperty(oPath + "/WEATHER", 'Zonnig');
			oRaceMetaData.setProperty(oPath + "/CAR_ID", 'URE11');
			oRaceMetaData.setProperty(oPath + "/NAME_DRIVER", 'The Stig');
			oRaceMetaData.setProperty(oPath + "/LENGTH_DRIVER", 202);
			oRaceMetaData.setProperty(oPath + "/WEIGHT_DRIVER", 78);
			oRaceMetaData.setProperty(oPath + "/DISTANCE", 22000);

		},

		onInit: function() {

			this.router = sap.ui.core.UIComponent.getRouterFor(this);
			this.router.attachRoutePatternMatched(this._handleRouteMatched, this);

			// Attaches validation handlers
			sap.ui.getCore().attachValidationError(function(oEvent) {
				oEvent.getParameter("element").setValueState(ValueState.Error);
			});
			sap.ui.getCore().attachValidationSuccess(function(oEvent) {
				oEvent.getParameter("element").setValueState(ValueState.None);
			});

			//First read the latest Race and Run ID from the backend.
			var oRaceMetaData = new ODataModel("/destinations/McCoy_URE/UreMetadata.xsodata/", {
				json: true,
				loadMetadataAsync: false
			});
			oRaceMetaData.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);

			this.getView().setModel(oRaceMetaData);
			sap.ui.getCore().setModel(oRaceMetaData, "oRaceMetaData");

			var me = this;

			var path = "/URE_METADATA";
			var aParameters = new Array("$top=1");

			var aSorter = new sap.ui.model.Sorter("RACE_ID", true);
			var aSorters = new Array(aSorter);

			oRaceMetaData.read(path, {
				urlParameters: aParameters,
				sorters: aSorters,
				success: function(oData, response) {
					raceID = oData.results[0].RACE_ID + 1;
					runID = 1;
					me.createEntry(raceID, runID);
				},
				error: function(oError) {
					sap.m.MessageToast.show(oError.message);
				}
			});

		},

		readLatest: function() {

			var oRaceMetaData = this.getView().getModel();
			var oContext = this.getView().getBindingContext();
			var oPath = oContext.getPath();
			
			raceID = oRaceMetaData.getProperty(oPath + "/RACE_ID");
			runID = oRaceMetaData.getProperty(oPath + "/RUN_ID");

			var oId = sap.ui.getCore().getModel("ID");
			oId.oData.raceID = raceID;
			oId.oData.runID = runID;
			
			//oRaceMetaData.deleteCreatedEntry(oContext);
			//this.createEntry(raceID, runID);

		},

		createEntry: function(raceID, runID) {

			var oRaceMetaData = this.getView().getModel();
			oRaceMetaData.refresh(true, true);
			var data = {
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
				"DRIVER_NOTES": null,
				"DISTANCE": null
			};
			var oContext = oRaceMetaData.createEntry("/URE_METADATA", {
				properties: data
			});
			var path = oContext.getPath();
			this.getView().bindElement(path);

			var oModel = new sap.ui.model.json.JSONModel({
				raceID: raceID,
				runID: runID
			});

			sap.ui.getCore().setModel(oModel, "ID");
		},

		clearModel: function() {},

		onAfterRendering: function() {},

		clearEntries: function() {

		},

		saveTest: function() {
			if (this.onValidate()) {
				var me = this;
				var oRaceMetaData = this.getView().getModel();
				var oPath = this.getView().getBindingContext().getPath();
				oRaceMetaData.setProperty(oPath + "/START_TIME", new Date());

				if (oRaceMetaData.hasPendingChanges()) {
					oRaceMetaData.submitChanges({
						success: function(oData) {
							me.goToOverview();
							//	sap.m.MessageToast.show("Succesfully saved");
						},
						error: function(oError) {
							sap.m.MessageToast.show(oError.message);
						}
					});
				} else {
					sap.m.MessageToast.show("No updates");
				}
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

			var oPath = this.getView().getBindingContext().getPath();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

			oRouter.navTo("Overview", {
				id: 1,
				metaDataPath: oPath
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
		 
		 onRaceSelected: function(){
				var oRaceMetaData = this.getView().getModel();
				var oPath = this.getView().getBindingContext().getPath();
				var raceType = oRaceMetaData.getProperty(oPath + "/RACE_TYPE");
				var label = this.getView().byId("__labelDistance");
				var input = this.getView().byId("Input_Distance");
				if (raceType === "Endurance"){
		 		label.setVisible(true);
		 		input.setVisible(true);
				} else{
					label.setVisible(false);
					input.setVisible(false);
				}
		 },
		 
		goToHistory: function() {
			crudTest = "R";
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("SmartHistory", { //Router navigation is done in manifest.json Code Editor
				id: 1
			}, false);
		},

		_handleRouteMatched: function(evt) {
			if ("CreateTest" !== evt.getParameter("name")) {
				return;
			}

			if (crudTest === "C") {
				this.createEntry(raceID, runID);
			} else {
				if (crudTest === "R") {
					this.readLatest();
				}

			}
		}

	});
});