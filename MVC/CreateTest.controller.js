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
			// If it's a new test then clear the model, so that input fields become empty.
			if (crudTest === "C") {
				//this.clearModel();
			}
			var oRaceMetaData = new sap.ui.model.odata.ODataModel("/destinations/McCoy_URE/UreMetadata.xsodata/");
			oRaceMetaData.oHeaders = {
				"DataServiceVersion": "3.0",
				"MaxDataServiceVersion": "3.0"
			};
			this.getView().setModel(oRaceMetaData, "RaceMetaData");
			oRaceMetaData.read("/URE_METADATA?$orderby=RACE_ID%20desc&$top=1", null, null, false, function(oData, oResponse) {
				raceID = oData.results[0].RACE_ID + 1;
				runID = 1;
			});
			//successful output  
			this.getView().byId("Race_Id").setValue(raceID);
			this.getView().byId("Run_Id").setValue(runID);
			var oModel = new sap.ui.model.json.JSONModel({
				raceID: raceID,
				runID: runID
			});
			sap.ui.getCore().setModel(oModel, "ID");
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
		saveTest: function() {
			if (this.onValidate()) {
				var requestObj = {
					requestUri: "",
					method: "",
					headers: {
						"X-Requested-With": "XMLHttpRequest",
						"Content-Type": "application/json;odata=minimalmetadata",
						"DataServiceVersion": "3.0",
						"MaxDataServiceVersion": "3.0",
						"Accept": "application/json;odata=minimalmetadata"
					}
				};
				var data = {
					"RACE_ID": this.isEmpty(this.getView().byId("Race_Id").getValue()),
					"RUN_ID": this.isEmpty(this.getView().byId("Run_Id").getValue()),
					"CIRCUIT": this.isEmpty(this.getView().byId("Input_Circuit").getValue()),
					"TEMPERATURE": this.isEmpty(this.getView().byId("Input_Temperature").getSelectedKey()),
					"RACE_DESCRIPTION": this.isEmpty(this.getView().byId("Input_Race_Description").getValue()),
					"START_TIME": new Date(),
					"END_TIME": null,
					"RACE_TYPE": this.isEmpty(this.getView().byId("Input_RaceType").getSelectedKey()),
					"WEATHER": this.isEmpty(this.getView().byId("Input_Weather").getSelectedKey()),
					"NOTES": this.isEmpty(this.getView().byId("Input_Notes").getValue()),
					"CAR_ID": this.isEmpty(this.getView().byId("Input_CarID").getValue()),
					"CAR_NOTES": this.isEmpty(this.getView().byId("Input_CarNotes").getValue()),
					"NAME_DRIVER": this.isEmpty(this.getView().byId("Input_DriverName").getValue()),
					"LENGTH_DRIVER": this.isEmpty(this.getView().byId("Input_DriverLength").getValue()),
					"WEIGHT_DRIVER": this.isEmpty(this.getView().byId("Input_DriverWeight").getValue()),
					"DRIVER_NOTES": this.isEmpty(this.getView().byId("Input_DriverNotes").getValue())
				};
				var method;
				var url;
				// Create
				if (crudTest === "C") {
					url = "/destinations/McCoy_URE/UreMetadata.xsodata/URE_METADATA";
					method = "POST";
				} // Update
				else if (crudTest === "U") {
					url = "/destinations/McCoy_URE/UreMetadata.xsodata/URE_METADATA('" + raceID + "')";
					method = "PUT";
				}
				requestObj.requestUri = url;
				requestObj.method = method;
				requestObj.data = data;
				//requestObj.success = this.goToOverview(); // Aanroepen overview scherm
				var me = this;
				OData.request(requestObj, function() {
					
					me.goToOverview();
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
			oRouter.navTo("History", {        //Router navigation is done in manifest.json Code Editor
				id: 2
			}, false);
		}
	});
});