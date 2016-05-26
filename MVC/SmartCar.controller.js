sap.ui.define(["JS/validator", "sap/ui/model/odata/v2/ODataModel",
	"sap/ui/core/mvc/Controller"
], function() {
	"use strict";
	return sap.ui.controller("MVC.SmartCar", {
		onInit: function() {
		    var oVizFrame = this.getView().byId("ItemsSmartChart");
		    
		    var oOverview = new sap.ui.model.odata.ODataModel("/destinations/McCoy_URE/Overview.xsodata/", true);
			
			oVizFrame.setModel(oOverview, "oOverView");
		},

		onAfterRendering: function() {
			var me = this;
			//me.sortHistory();
		},

		onExit: function() {
			//var smartTable = this.getView().byId("LineItemsSmartTable");
			//smartTable.exit();
		},

		onBeforeRebindFunc: function(oEvent) {
// 			var oBindingParams = oEvent.getParameter("bindingParams");
// 			oBindingParams.parameters = oBindingParams.parameters || {};
// 			oBindingParams.parameters.select = '*'; // for selecting all fields in query or add specific fields
		},

		onNavBack: function() {
			window.history.go(-1);
		}
	});
});