sap.ui.define(["sap/ui/core/mvc/Controller"], function(Controller) {
	"use strict";
	return Controller.extend("MVC.History", {
		selectHistory: function(oEvent) {
		    var oId = sap.ui.getCore().getModel("ID");
			var oSelectedItem = oEvent.getParameter("listItem");
			var oSelectedRaceID = oSelectedItem.getBindingContext().getProperty("RACE_ID");
			var oSelectedRunID = oSelectedItem.getBindingContext().getProperty("RUN_ID");
			
			raceID = oSelectedRaceID;
			runID = oSelectedRunID;
			
			oId.oData.raceID = oSelectedRaceID;
		    oId.oData.runID = oSelectedRunID;
		    oId.updateBindings();
			
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Overview", {
				//Router navigation is done in manifest.json Code Editor
				id: 1
			}, false);
		},
		onNavBack: function() {
			window.history.go(-1);
			crudTest = "C";
			debugger;
		},

		onInit: function() {
			crudTest = "R";
			var oRaceHistory = new sap.ui.model.odata.ODataModel("/destinations/McCoy_URE/UreMetadata.xsodata/");

			this.getView().setModel(oRaceHistory);
			var tab = this.getView().byId("__table1");
			var aSorter = [];
			aSorter.push(new sap.ui.model.Sorter("RACE_ID", true));
			aSorter.push(new sap.ui.model.Sorter("RUN_ID", true));
			var oBinding = tab.getBinding("items");
			oBinding.sort(aSorter);
		},

		deleteSelected: function() {

			var oTable = this.byId("__table1");
			var oSelectedItems = oTable.getSelectedItems();

			for (var i = 0; i <= oSelectedItems.length; i++) {
				var oSelectedItem = oSelectedItems[i];
				var sPath = oSelectedItem.getBindingContext().getPath();
				var oModel = oTable.getModel().getObject(sPath);
				var raceID = oModel.RACE_ID;
				var runID = oModel.RUN_ID;
				var oRaceHistory = this.getView().getModel();

				oRaceHistory.remove("/URE_METADATA(RACE_ID=" + raceID + ",RUN_ID=" + runID + ")", null, function() {
					sap.m.MessageToast.show("Test verwijderd");
					oRaceHistory.refresh();
				}, function() {
					sap.m.MessageToast.show("Test verwijderen is mislukt");
				});
				//oRaceMetaData.refresh(true);
			}
		}
	});
});