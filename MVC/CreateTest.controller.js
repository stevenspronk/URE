/*global sap */

sap.ui.define([
    "JS/validator"
], function (Validator) {
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
					if (crudTest === 'C') {
						//this.clearModel();
					}

					var oRaceMetaData = new sap.ui.model.odata.ODataModel("/destinations/McCoy_URE/UreMetadata.xsodata/");

					oRaceMetaData.oHeaders = {
						"DataServiceVersion": "3.0",
						"MaxDataServiceVersion": "3.0"
					};

					this.getView().setModel(oRaceMetaData, "RaceMetaData");

					var oBindings = this.getView().getModel("RaceMetaData").bindList("/URE_METADATA");

					// Generate a RACE ID and bind it to the input
					raceID = oBindings.getLength() + 1;
					this.getView().byId("Race_Id").setValue(oBindings.getLength() + 1);
				},

				clearModel: function() {

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
				onAfterRendering: function() {

				},

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
							requestUri: '',
							method: '',
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
						if (crudTest === 'C') {
							url = "/destinations/McCoy_URE/UreMetadata.xsodata/URE_METADATA";
							method = "POST";
						}
						// Update
						else if (crudTest === 'U') {
							url = "/destinations/McCoy_URE/UreMetadata.xsodata/URE_METADATA('" + raceID + "')";
							method = "PUT";
						}

						requestObj.requestUri = url;

						requestObj.method = method;
						requestObj.data = data;
						requestObj.success = this.goToOverview(); // Aanroepen overview scherm

						OData.request(requestObj, function() {

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
					crudTest = 'U';
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
        }

})});