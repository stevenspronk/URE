sap.ui.define(["sap/ui/core/mvc/Controller"], function(Controller) {
	"use strict";
	return Controller.extend("MVC.History", {

		selectHistory: function(oEvent) {
			var oSelectedItem = oEvent.getParameter("listItem");
			var oSelectedRaceID = oSelectedItem.getBindingContext().getProperty("RACE_ID");
			var oSelectedRunID = oSelectedItem.getBindingContext().getProperty("RUN_ID");

			raceID = oSelectedRaceID;
			runID = oSelectedRunID;

			var oModel = new sap.ui.model.json.JSONModel({
				raceID: raceID,
				runID: runID
			});
			sap.ui.getCore().setModel(oModel, "ID");

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Overview", { //Router navigation is done in manifest.json Code Editor
				id: 1
			}, false);
		},
		onNavBack: function() {
			window.history.go(-1);
		},

		onInit: function() {
			crudTest = 'R';

			var oRaceHistory = new sap.ui.model.odata.ODataModel("/destinations/McCoy_URE/UreMetadata.xsodata/");
			oRaceHistory.oHeaders = {
				"DataServiceVersion": "3.0",
				"MaxDataServiceVersion": "3.0"
			};

			this.getView().setModel(oRaceHistory);
			var tab = this.getView().byId("__table1");

			var aSorter = [];
			aSorter.push(new sap.ui.model.Sorter("RACE_ID", true));
			aSorter.push(new sap.ui.model.Sorter("RUN_ID", true));

			var oBinding = tab.getBinding("items");

			oBinding.sort(aSorter);
		}
	});
});