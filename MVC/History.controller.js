sap.ui.define(['sap/m/Button',
	'sap/m/Dialog',
	'sap/m/MessageToast',
	'sap/m/Text',
	'sap/m/TextArea',
	'sap/ui/core/mvc/Controller',
	'sap/ui/layout/HorizontalLayout',
	'sap/ui/layout/VerticalLayout'
], function(Button, Dialog, MessageToast, Text, TextArea, Controller, HorizontalLayout, VerticalLayout) {
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
		},

		onInit: function() {
			var oRaceHistory = new sap.ui.model.odata.ODataModel("/destinations/McCoy_URE/UreMetadata.xsodata/");
            
            this.getView().setModel(oRaceHistory);
			sap.ui.getCore().setModel(oRaceHistory, "oRaceHistory");
			//this.getView().setModel(oRaceHistory); //this.getView()
			var tab = this.getView().byId("__table1");
			var aSorter = [];
			aSorter.push(new sap.ui.model.Sorter("RACE_ID", true));
			aSorter.push(new sap.ui.model.Sorter("RUN_ID", true));
			var oBinding = tab.getBinding("items");
			oBinding.sort(aSorter);
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
			var oTable = this.byId("__table1");
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