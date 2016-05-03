sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";
	var activeView;
	var wait;
	var emptyMetaData = ({
		"RACE_ID": null,
		"RUN_ID": null,
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
	return Controller.extend("MVC.Overview", {

		onInit: function() {
			var self = this;

			this.router = sap.ui.core.UIComponent.getRouterFor(this);
			this.router.attachRoutePatternMatched(this._handleRouteMatched, this);

			//Create a model to store in which tab we are (filled from the Overview.controller.js)
			//We fill it initially with the Dashboard view
			var oSelection = new sap.ui.model.json.JSONModel({
				selectedView: "Dashboard"
			});
			sap.ui.getCore().setModel(oSelection, "Selection");

			$(window).bind('beforeunload', function(e) {
				self.newTest();
			});
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
			// 			var oEventBus = sap.ui.getCore().getEventBus();
			// 			oEventBus.publish("ViewMode", "showHideButtons");
			if (crudTest === "R") {
				this.oView.byId("_newTestBtn").setVisible(false);
				this.oView.byId("_newRunBtn").setVisible(false);
				this.oView.byId("_appView").setShowNavButton(true);
			}

			if (crudTest === "C") {
				this.oView.byId("_newTestBtn").setVisible(true);
				this.oView.byId("_newRunBtn").setVisible(true);
				this.oView.byId("_appView").setShowNavButton(false);
			}

			if (crudTest === "U") {
				this.oView.byId("_newTestBtn").setVisible(true);
				this.oView.byId("_newRunBtn").setVisible(true);
				this.oView.byId("_appView").setShowNavButton(false);
			}
			wait = false;

			var oID = sap.ui.getCore().getModel("ID");
			this.getView().setModel(oID, "ID");
		},

		onAfterRendering: function() {
			// The app should refresh the data continuesly, but not all models, only the models of the active tab
			var me = this;

			setTimeout(function() {
				setInterval(function() {
					var oSelection = sap.ui.getCore().getModel("Selection");
					var key = oSelection.oData.selectedView;

					if (!wait) {
						me.refreshData(key);
					}

				}, 1000);
			}, 1000);

		},

		refreshData: function(key) {
			switch (key) {
				case "Powertrain":
					var oMsg = sap.ui.getCore().getModel("Msg");
					oMsg.refresh();
					break;
				case "Dashboard":
					var url = "/destinations/McCoy_URE/Overview.xsodata/OVERVIEW?$filter=RACE_ID%20eq%20" + raceID + "%20and%20RUN_ID%20eq%20" +
						runID +
						"&$orderby=SENSOR_TIMESTAMP%20desc&$top=1&$format=json";
					var dashboardModel = sap.ui.getCore().getModel("Overview");
					dashboardModel.loadData(url);
					break;
				case "Car":

					break;
				case "Driver":

					break;
			}
		},

		onNavBack: function() {
			window.history.go(-1);
		},

		navButtonTap: function() {
			this.getView().invalidate();
			window.history.go(-1);
		},

		newTest: function() {
			if (crudTest === "U") {
				var me = this;

				//We save the current test
				this.saveCurrentTest(function() {

					raceID = raceID + 1;
					runID = 1;
					// Set variable crudTest to C = Create		
					crudTest = 'C';
					wait = true;

					var router = sap.ui.core.UIComponent.getRouterFor(me);
					router.navTo("CreateTest");
				});

			}
		},
		saveCurrentTest: function(callBack) {
			var oRaceMetaData = sap.ui.getCore().getModel("oRaceMetaData");

			var oPath = "/URE_METADATA(RACE_ID=" + raceID + ",RUN_ID=" + runID + ")";
			oRaceMetaData.setProperty(oPath + "/END_TIME", new Date());

			if (oRaceMetaData.hasPendingChanges()) {
				oRaceMetaData.submitChanges({
					success: function(oData) {
						sap.m.MessageToast.show("Test opgeslagen");
						callBack();
					},
					error: function(oError) {
						sap.m.MessageToast.show("Error with update");
					}
				});
			} else {
				sap.m.MessageToast.show("No updates");
			}
		},
		createNewRun: function(callBack) {

			var oRaceMetaData = sap.ui.getCore().getModel("oRaceMetaData");

			var oPath = "/URE_METADATA(RACE_ID=" + raceID + ",RUN_ID=" + runID + ")";
			var data = oRaceMetaData.getProperty(oPath);

			oRaceMetaData.refresh(true, true);

			runID = runID + 1;
			data.START_TIME = new Date();
			data.END_TIME = null;
			data.RUN_ID = runID;

			oRaceMetaData.createEntry("/URE_METADATA", {
				properties: data
			});

			if (oRaceMetaData.hasPendingChanges()) {
				oRaceMetaData.submitChanges({
					success: function(oData) {
						sap.m.MessageToast.show("Run " + runID + " gestart");
						callBack();
					},
					error: function(oError) {
						sap.m.MessageToast.show("Error with update");
					}
				});
			} else {
				sap.m.MessageToast.show("No updates");
			}

		},

		newRun: function() {
			if (crudTest === "U") {

				var oId = this.getView().getModel("ID");
				var me = this;
				wait = true;

				this.saveCurrentTest(function() {

					me.createNewRun(function() {
						oId.oData.runID = runID;
						oId.updateBindings();
						wait = false;
					});
				});
			}
		}
	});
});