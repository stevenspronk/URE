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

			if (crudTest === "R") {
				this.oView.byId("_newTestBtn").setVisible(false);
				this.oView.byId("_newRunBtn").setVisible(false);
				this.getView().byId("_appView").setShowNavButton(true);
			}

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
			var id = evt.getParameter("arguments").id;
			var model = new sap.ui.model.json.JSONModel({
				id: id
			});
			this.getView().setModel(model, "data");
			wait = false;
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
			window.history.go(-1);
		},

		newTest: function() {
			if (crudTest === "U") {

				//First get current raceID and runID
				var oId = sap.ui.getCore().getModel("ID");
				var raceID = oId.oData.raceID;
				var runID = oId.oData.runID;

				//We save the current test
				this.saveCurrentTest(raceID, runID, function() {
					console.log("saved");
				});

				//Create a new empty metadata and set new raceID, runID, and StartTime
				var data = emptyMetaData;
				raceID = raceID + 1;
				runID = 1;
				data.RACE_ID = raceID;
				data.RUN_ID = runID;
				oId.oData.raceID = raceID;
				oId.oData.runID = runID;
				
				data.START_TIME = new Date();

				sap.ui.getCore().getModel("RaceMetaData").setData(data);
				var oRaceMetaData = sap.ui.getCore().getModel("oRaceMetaData")
				oRaceMetaData.createEntry("/URE_METADATA", data);

				// Set variable crudTest to C = Create		
				crudTest = 'C';
				wait = true;

				var router = sap.ui.core.UIComponent.getRouterFor(this);
				router.navTo("CreateTest", {
					id: 1
				}, false);

			}
		},
		saveCurrentTest: function(raceID, runID, callBack) {
			var oRaceMetaData = sap.ui.getCore().getModel("oRaceMetaData");
			var data = sap.ui.getCore().getModel("RaceMetaData").getData();
			data.END_TIME = new Date();

			oRaceMetaData.submitChanges(function(oData, oResponse) {
					console.log(oResponse);
					callBack();
				},
				function(oError) {
					alert(oError.message);
				});

		},
		createNewRun: function(raceID, runID) {
			var oRaceMetaData = sap.ui.getCore().getModel("oRaceMetaData");
			var RaceMetaData = sap.ui.getCore().getModel("RaceMetaData");
			var data = RaceMetaData.getData();

			data.START_TIME = new Date();
			data.END_TIME = null;
			data.RUN_ID = runID;

			RaceMetaData.setData(data);
			oRaceMetaData.createEntry("/URE_METADATA", data);
		},
		
		newRun: function() {
			if (crudTest === "U") {

				var oId = sap.ui.getCore().getModel("ID");
				var raceID = oId.oData.raceID;
				var runID = oId.oData.runID;
				var me = this;
				wait = true;

				this.saveCurrentTest(raceID, runID, function() {
					runID = runID + 1;
					oId.oData.runID = runID;

					me.createNewRun(raceID, runID);
		

					wait = false;
				});
			}
		}
	});
});
