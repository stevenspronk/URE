sap.ui.define(["JS/validator", "sap/m/TablePersoController", "sap/m/TablePersoProvider", "sap/ui/model/odata/v2/ODataModel",
	"sap/ui/core/mvc/Controller"
], function() {
	"use strict";
	return sap.ui.controller("MVC.SmartHistory", {
		onInit: function() {
			var oRaceHistory = new sap.ui.model.odata.ODataModel("/destinations/McCoy_URE/UreMetadata.xsodata/");
			this.getView().setModel(oRaceHistory);
			sap.ui.getCore().setModel(oRaceHistory, "oRaceHistory");
		},

		onAfterRendering: function() {
			var oTable = this.getView().byId("RaceTable");
			var oBinding = oTable.getBinding("items");
			var aSorter = new sap.ui.model.Sorter("START_TIME", true);
			oBinding.sort(aSorter);
		},

		onExit: function() {
			var smartTable = this.getView().byId("LineItemsSmartTable");
			smartTable.exit();
		},

		onBeforeRebindFunc: function(oEvent) {
			var oBindingParams = oEvent.getParameter("bindingParams");
			oBindingParams.parameters = oBindingParams.parameters || {};
			oBindingParams.parameters.select = '*'; // for selecting all fields in query or add specific fields
		},

		selectHistory: function() {
			var oTable = this.byId("RaceTable");
			var oSelectedItems = oTable.getSelectedItems();

			var i;
			for (i = 0; i < oSelectedItems.length; i++) {
				var oSelectedItem = oSelectedItems[i];
				var sPath = oSelectedItem.getBindingContext().getPath();
			}

			if (oSelectedItem) {
				var oDetail = this.getView().getModel().getProperty(sPath);
				raceID = oDetail.RACE_ID;
				runID = oDetail.RUN_ID;

				var oModel = new sap.ui.model.json.JSONModel({
					raceID: raceID,
					runID: runID
				});

				sap.ui.getCore().setModel(oModel, "ID");

				// WHEN WORKING WITH COLUMNLISTITEMS            
				// 			var oId = sap.ui.getCore().getModel("ID");
				// 			var oSelectedItem = oEvent.getParameter("listItem");
				// 			var oSelectedRaceID = oSelectedItem.getBindingContext().getProperty("RACE_ID");
				// 			var oSelectedRunID = oSelectedItem.getBindingContext().getProperty("RUN_ID");

				// 			raceID = oSelectedRaceID;
				// 			runID = oSelectedRunID;

				// 			oId.oData.raceID = oSelectedRaceID;
				// 			oId.oData.runID = oSelectedRunID;
				// 			oId.updateBindings();

				if (i === 1) {
					var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
					oRouter.navTo("Overview", {
						//Router navigation is done in manifest.json Code Editor
						id: 1
					}, false);
				} else {
					console.log("error");
				}
			}

			if (i < 1) {
				sap.m.MessageToast.show("Selecteer minimaal één test");
			}

			if (i > 1) {
				sap.m.MessageToast.show("Selecteer maximaal één test");
			}

		},

		onNavBack: function() {
			window.history.go(-1);
			crudTest = "R";
		},

		deleteSelected: function() {
			var me = this;

			var dialog = new sap.m.Dialog({
				title: "Confirm",
				type: "Message",
				content: new Text({
					text: "Weet je zeker dat je de geselecteerde items wilt verwijderen?"
				}),
				beginButton: new sap.m.Button({
					text: "Ja",
					press: function() {
						dialog.close();
						me.deleteSelectedDialog();
					}
				}),
				endButton: new sap.m.Button({
					text: "Annuleren",
					press: function() {
						dialog.close();
					}
				}),
				afterClose: function() {
					dialog.destroy();
				}
			});
			dialog.open();
		},

		deleteSelectedDialog: function() {
			var oTable = this.byId("RaceTable");
			var oSelectedItems = oTable.getSelectedItems();

			var i;
			for (i = 0; i < oSelectedItems.length; i++) {
				var oSelectedItem = oSelectedItems[i];
				var sPath = oSelectedItem.getBindingContext().getPath();
				var oModel = oTable.getModel().getObject(sPath);
				var raceID = oModel.RACE_ID;
				var runID = oModel.RUN_ID;
				var oRaceHistory = sap.ui.getCore().getModel("oRaceHistory");
				oRaceHistory.remove("/URE_METADATA(RACE_ID=" + raceID + ",RUN_ID=" + runID + ")", null, function() {

				}, function() {
					sap.m.MessageToast.show("Test verwijderen is mislukt");
				});
			}

			oRaceHistory.refresh(true);

			if (i === 1) {
				sap.m.MessageToast.show("Test verwijderd");
			}

			if (i > 1) {
				sap.m.MessageToast.show("Tests verwijderd");
			}
		}
	});
});