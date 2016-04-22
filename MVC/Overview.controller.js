var activeView;
var wait;

sap.ui.controller("MVC.Overview", {

	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 * @memberOf MVC.Overview
	 */
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

				if (!wait) {
					me.refreshData(key);
				}

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
				var url = "/destinations/McCoy_URE/Overview.xsodata/OVERVIEW?$filter=RACE_ID%20eq%20" + raceID + "%20and%20RUN_ID%20eq%20" + runID +
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
		if (crudTest === "U") {

			var oRaceMetaData = sap.ui.getCore().getModel("oRaceMetaData");
			var data = sap.ui.getCore().getModel("RaceMetaData").getData();
			data.END_TIME = new Date();
			oRaceMetaData.oData[0] = data;

			var oId = sap.ui.getCore().getModel("ID");
			var raceID = oId.oData.raceID;
			var runID = oId.oData.runID;
            
            var path = "/URE_METADATA(RACE_ID=" + raceID + ",RUN_ID=" + runID + ")";
			oRaceMetaData.update(path, data, null, function(oData, oResponse) {
					console.log(oResponse);
				},
				function(oData, oResponse) {
					alert(oResponse);
				});
		

			data = ({
				"RACE_ID": raceID + 1,
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

			// Set variable crudTest to C = Create		
			crudTest = 'C';

			var router = sap.ui.core.UIComponent.getRouterFor(this);
			router.navTo("CreateTest", {
				id: 1
			}, false);

			sap.m.MessageToast.show("Test gestopt en opgeslagen");
		}
	},

	newRun: function() {
		if (crudTest === "U") {

			//First we get the current data, add an end-time and update the backend with a HTTP PUT request
			var RaceModel = sap.ui.getCore().getModel("RaceMetaData");
			RaceModel.oData.END_TIME = new Date();

			var oId = sap.ui.getCore().getModel("ID");
			var raceID = oId.oData.raceID;
			var runID = oId.oData.runID;

			var method = "PUT";
			var url = "/destinations/McCoy_URE/UreMetadata.xsodata/URE_METADATA(RACE_ID=" + raceID + ",RUN_ID=" + runID + ")";
			var requestObj = {
				requestUri: url,
				method: method,
				data: RaceModel.oData,
				headers: {
					"X-Requested-With": "XMLHttpRequest",
					"Content-Type": "application/json;odata=minimalmetadata",
					"DataServiceVersion": "3.0",
					"MaxDataServiceVersion": "3.0",
					"Accept": "application/json;odata=minimalmetadata"
				}
			};
			wait = true;
			OData.request(requestObj, function() {

				//Then we add 1 to the RunId, set a new start time and clear the end time
				//The rest of the meta data should stay the same
				runID = runID + 1;
				oId.oData.runID = runID;
				RaceModel.oData.RUN_ID = runID;
				RaceModel.oData.START_TIME = new Date();
				RaceModel.oData.END_TIME = null;

				var requestObj2 = {
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

				var data2 = RaceModel.oData;
				var method2;
				var url2;

				url2 = "/destinations/McCoy_URE/UreMetadata.xsodata/URE_METADATA";
				method2 = "POST";

				requestObj.requestUri = url2;
				requestObj.method = method2;
				requestObj.data = data2;
				//requestObj.success = this.goToOverview(); // Aanroepen overview scherm

				OData.request(requestObj2, function() {
						wait = false;
						alert("Update successful");
					},
					function() {
						wait = false;
						alert("Update failed");
					}

				);

			});

		}
	}
});