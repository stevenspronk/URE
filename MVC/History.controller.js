sap.ui.define(["sap/ui/core/mvc/Controller"], function(Controller) {
	"use strict";
	return Controller.extend("MVC.History", {
		/**
		 *@memberOf ProfileServices.controller.Overview
		 */
		selectHistory: function(oEvent) {
			// var oTable = this.byId("__table1");
			// var oSelectedItem = oTable.getSelectedItem();
			// var sPath = oSelectedItem.getBindingContext().getPath();
			// var oDetail = this.getView().getModel().getProperty(sPath);
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
			// var end_date = new Date(oDetail.DateEnd);
			// var start_time = new Date(oDetail.TimeStart.ms).getUTCHours() + ":" + new Date(oDetail.TimeStart.ms).getUTCMinutes() + ":" + new Date(oDetail.TimeStart.ms).getUTCSeconds();
			// var end_time = new Date(oDetail.TimeEnd.ms).getUTCHours() + ":" + new Date(oDetail.TimeEnd.ms).getUTCMinutes() + ":" + new Date(oDetail.TimeStart.ms).getUTCSeconds();
			// this.getView().byId("txtStartDate").setDateValue(start_date);
			// this.getView().byId("txtStartTime").setValue(start_time);
			// this.getView().byId("txtEndDate").setDateValue(end_date);
			// this.getView().byId("txtEndTime").setValue(end_time);
			// this.getView().byId("intensityRating").setValue(parseFloat(oDetail.Intensity));
			// this.getView().byId("location").setSelectedKey(oDetail.LocationId);
			// this.getView().byId("userId").setText(oDetail.UserId);
			// this.getView().byId("comment").setValue(oDetail.Comment);
			
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Overview", { //Router navigation is done in manifest.json Code Editor
				id: 1
			}, false);
		},
		onNavBack: function() {
			window.history.go(-1);
		},
		// 		updateEntry: function () {
		// 			var oEntry = {};
		// 			oEntry.UserId = this.getView().byId("userId").getText();
		// 			oEntry.DateStart = this.getView().byId("txtStartDate").getValue();
		// 			oEntry.TimeStart = this.getView().byId("txtStartTime").getValue();
		// 			oEntry.DateEnd = this.getView().byId("txtEndDate").getValue();
		// 			oEntry.TimeEnd = this.getView().byId("txtEndTime").getValue();
		// 			oEntry.Intensity = this.getView().byId("intensityRating").getValue().toString();
		// 			if (this.getView().byId("vomit").getSelected() === true) {
		// 				oEntry.Vomit = "X";
		// 			} else {
		// 				oEntry.Vomit = " ";
		// 			}
		// 			if (this.getView().byId("nausea").getSelected() === true) {
		// 				oEntry.Nausea = "X";
		// 			} else {
		// 				oEntry.Nausea = " ";
		// 			}
		// 			if (this.getView().byId("hypersensitivity").getSelected() === true) {
		// 				oEntry.Hypersensitivity = "X";
		// 			} else {
		// 				oEntry.Hypersensitivity = " ";
		// 			}
		// 			oEntry.LocationId = parseInt(this.getView().byId("location").getSelectedKey());
		// 			oEntry.Comment = this.getView().byId("comment").getValue();
		// 			var splitTime = oEntry.TimeStart.split(":");
		// 			var timekey = "PT" + splitTime[0] + "H" + splitTime[1] + "M" + splitTime[2] + "S";
		// 			oEntry.TimeStart = timekey;
		// 			var splitTimeEnd = oEntry.TimeEnd.split(":");
		// 			var timekeyend = "PT" + splitTimeEnd[0] + "H" + splitTimeEnd[1] + "M" + splitTimeEnd[2] + "S";
		// 			oEntry.TimeEnd = timekeyend;
		// 			var datesplit = oEntry.DateStart.split("/");
		// 			var tempDateStart = new Date(datesplit[2], datesplit[1], datesplit[0]);
		// 			//	console.log(tempDateStart);
		// var datekey = tempDateStart.getFullYear() + "-" + (tempDateStart.getMonth() + 1) + "-" + tempDateStart.getDate() + "T00:00:00.0000000";
		// 			oEntry.DateStart = datekey;
		// 			var datesplit2 = oEntry.DateEnd.split("/");
		// 			var tempDateEnd = new Date(datesplit2[2], datesplit2[1], datesplit2[0]);
		// 			var datekeyend = "/Date(" + tempDateEnd.getTime() + ")/";
		// 			oEntry.DateEnd = datekeyend;
		// 			var oModel = this.getView().getModel();
		// 			var sPath = "/Attack(UserId='" + oEntry.UserId + "',DateStart=datetime'" + datekey + "',TimeStart=time'" + timekey + "')";
		// 			//var sPath = "Attack('" + oEntry.UserId + "','" + datekey + "','"+timekey+"')";
		// console.log(oEntry);
		// 			oModel.update(sPath, oEntry, null, function () {
		// 				console.log("update succeeded");
		// 			}, function () {
		// 				console.log("update failed");
		// 			});
		// 		},
		/**
		 *@memberOf MVC.History
		 */
		onInit: function() {
			//This code was generated by the layout editor.
			var oRaceHistory = new sap.ui.model.odata.ODataModel("/destinations/McCoy_URE/UreMetadata.xsodata/");
			oRaceHistory.oHeaders = {
				"DataServiceVersion": "3.0",
				"MaxDataServiceVersion": "3.0"
			};
			this.getView().setModel(oRaceHistory);
		},
		/**
		 *@memberOf MVC.History
		 */
		goToHistoryDashboard: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Overview", { //Router navigation is done in manifest.json Code Editor
				id: 1
			}, false);
		}
	});
});