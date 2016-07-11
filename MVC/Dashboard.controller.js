var iconTabBar;
var loaded;

sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"com/URE/Controls/smoothie"
], function(Controller) {
	"use strict";

	return Controller.extend("MVC.Dashboard", {

		onInit: function() {
			loaded = false;
			var url = "/destinations/McCoy_URE/Overview.xsodata/OVERVIEW?$filter=RACE_ID%20eq%20" + raceID + "%20and%20RUN_ID%20eq%20" + runID +
				"&$orderby=SENSOR_TIMESTAMP%20desc&$top=1&$format=json";
			var dashboardModel = new sap.ui.model.json.JSONModel(url);
			//	var data = dashboardModel.getData();
			//dashboardModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
			sap.ui.getCore().setModel(dashboardModel, "Overview");
			this.getView().setModel(dashboardModel, "Overview");
			//this.refreshSteer();

			// var $radialBrake = $("#radialBrake.text.sapSuiteUiMicroChartRMCFont.sapSuiteUiMicroChartRMCErrorTextColor");
			// $radialBrake.text("Brake");
			// $("#radialBrake.text.sapSuiteUiMicroChartRMCFont.sapSuiteUiMicroChartRMCErrorTextColor").text("Brake");

			var me = this;

			// me.cellVoltageChart();

			setTimeout(function() {
				setInterval(function() {
					if (loaded === true) {
						me.refreshSteer();
					}
				}, 200);
			}, 200);
		},

		calculatePower: function(var1, var2) {
			var calc = var1 * var2;
			return calc;
		},

		refreshColor: function() {
			var minCellVoltText = this.byId("minCellVolt");
			var maxCellVoltText = this.byId("maxCellVolt");

			var waterBucket1 = this.byId("waterTemp1");
			var waterBucket2 = this.byId("waterTemp2");

			var me = this;
			var magicNumber = me.magic();
			var minVolt = magicNumber[0];
			var maxVolt = magicNumber[1];
			var waterTemp1 = magicNumber[2];
			var waterTemp2 = magicNumber[3];

			// Minimal Voltage Determination for color
			if (minVolt >= 0 && minVolt <= 2.90) {
				minCellVoltText.removeStyleClass("greenColor");
				minCellVoltText.removeStyleClass("yellowColor");
				minCellVoltText.addStyleClass("redColor");
			}
			if (minVolt >= 2.91 && minVolt <= 4.15) {
				minCellVoltText.removeStyleClass("redColor");
				minCellVoltText.removeStyleClass("yellowColor");
				minCellVoltText.addStyleClass("greenColor");
			}
			if (minVolt >= 4.16 && minVolt <= 4.20) {
				minCellVoltText.removeStyleClass("greenColor");
				minCellVoltText.removeStyleClass("redColor");
				minCellVoltText.addStyleClass("yellowColor");
			}
			if (minVolt >= 4.21) {
				minCellVoltText.removeStyleClass("greenColor");
				minCellVoltText.removeStyleClass("yellowColor");
				minCellVoltText.addStyleClass("redColor");
			}

			// Maximal Voltage Determination for color
			if (maxVolt >= 0 && maxVolt <= 2.90) {
				maxCellVoltText.removeStyleClass("greenColor");
				maxCellVoltText.removeStyleClass("yellowColor");
				maxCellVoltText.addStyleClass("redColor");
			}
			if (maxVolt >= 2.91 && maxVolt <= 4.15) {
				maxCellVoltText.removeStyleClass("redColor");
				maxCellVoltText.removeStyleClass("yellowColor");
				maxCellVoltText.addStyleClass("greenColor");
			}
			if (maxVolt >= 4.16 && maxVolt <= 4.20) {
				maxCellVoltText.removeStyleClass("greenColor");
				maxCellVoltText.removeStyleClass("redColor");
				maxCellVoltText.addStyleClass("yellowColor");
			}
			if (maxVolt >= 4.21) {
				maxCellVoltText.removeStyleClass("greenColor");
				maxCellVoltText.removeStyleClass("yellowColor");
				maxCellVoltText.addStyleClass("redColor");
			}

			// Water Bucket 1 Determination for color
			if (waterTemp1 >= 0 && minVolt <= 60) {
				waterBucket1.removeStyleClass("redColor");
				waterBucket1.addStyleClass("blueColor");
			}
			if (waterTemp1 >= 61) {
				waterBucket1.removeStyleClass("blueColor");
				waterBucket1.addStyleClass("redColor");
			}

			// Water Bucket 2 Determination for color
			if (waterTemp2 >= 0 && minVolt <= 60) {
				waterBucket2.removeStyleClass("redColor");
				waterBucket2.addStyleClass("blueColor");
			}
			if (waterTemp2 >= 61) {
				waterBucket2.removeStyleClass("blueColor");
				waterBucket2.addStyleClass("redColor");
			}
		},

		cellVoltageChart: function() {
			this.component = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this.getView()));

			// Get a reference to the model and add a TimeSeries property
			var chartModel = this.component.getModel("cellVoltage");

			var me = this;

			// Set variables for lines in JSON format
			chartModel.setProperty("/line0", new TimeSeries());
			chartModel.setProperty("/line100", new TimeSeries());
			chartModel.setProperty("/linereference", new TimeSeries());
			chartModel.setProperty("/cell1", new TimeSeries());
			chartModel.setProperty("/cell2", new TimeSeries());

			// Every 200ms a new magical number appears
			setInterval(function() {
				var magicNumber = me.magic();
				var cell1 = magicNumber[0];
				var cell2 = magicNumber[1];
				chartModel.getProperty("/line0").append(new Date().getTime(), 0);
				chartModel.getProperty("/line100").append(new Date().getTime(), 100);
				//	chartModel.getProperty("/linereference").append(new Date().getTime(), 60);
				chartModel.getProperty("/cell1").append(new Date().getTime(), cell1);
				chartModel.getProperty("/cell1").append(new Date().getTime(), cell2);
			}, 200);
		},

		drawLine: function() {
			var ctx = c.getContext("2d");
			ctx.beginPath();
			ctx.moveTo(10, 0);
			ctx.rotate(30 * Math.PI / 180);
			ctx.lineTo(10, 150);
		},

		onAfterRendering: function() {
			iconTabBar = this.getView().byId("Dashboard").getParent().getParent().getParent();
			loaded = true;

			var me = this;

			// me.cellVoltageChart();
			// debugger;
			// var radialBrake = this.getView().byId("radialBrake.text");
			// radialBrake.setText("Brake");
		if (crudTest !== "R") {
			setTimeout(function() {
				setInterval(function() {
					if (loaded === true) {
						me.refreshSteer();
						me.refreshColor();
					}
				}, 200);
			}, 200);
		}
			/* var dot = '<div style="text-align: left; width: 100%; height: 100%;  background-image: url(/IMG/dot.png); background-position: 50% 50%;  background-repeat: no-repeat;"></div>';   
	    var dotComponent = new sap.ui.core.HTML();
        dotComponent.setContent(dot);
        dotComponent.placeAt("__xmlview2--eight_curve", "only");*/
			// Get a reference to the smooty control of the view
			// var cellVoltage = this.byId("cellVoltage");
			// // Bind property TimeSeries to the chart
			//   // cellVoltage.addTimeSeries(
			//   // 	// Blank 0 line
			//   // 	this.component.getModel("cellVoltage").getProperty("/line0"),
			//   // 	{ 
			//   // 		strokeStyle: 'transparant', 
			//   // 		// fillStyle: 'rgba(0, 255, 0, 0.2)', 
			//   // 		lineWidth: 0 
			//   // 	});

			//   // cellVoltage.addTimeSeries(
			//   // 	// Blank 100 line
			//   // 	this.component.getModel("cellVoltage").getProperty("/line100"),
			//   // 	{ 
			//   // 		strokeStyle: 'transparant', 
			//   // 		// fillStyle: 'rgba(0, 255, 0, 0.2)', 
			//   // 		lineWidth: 0 
			//   // 	});

			//   cellVoltage.addTimeSeries(
			//   	this.component.getModel("cellVoltage").getProperty("/cell1"),
			//   	{ 
			//   		strokeStyle: '#65E624', 
			//   		// fillStyle: 'rgba(0, 255, 0, 0.2)', 
			//   		lineWidth: 4 
			//   	});

			//   cellVoltage.addTimeSeries(
			//   	this.component.getModel("cellVoltage").getProperty("/cell2"),
			//   	{ 
			//   		strokeStyle: '#65E624', 
			//   		// fillStyle: 'rgba(0, 255, 0, 0.2)', 
			//   		lineWidth: 4 
			//   	});

			//   // Start streaming
			//   cellVoltage.startStreaming(500);
		},

		// changeLineColor: function(cell1, cell2) {
		// 	// Get a reference to the smooty control of the view
		// 	var cellVoltage = this.byId("cellVoltage");
		// 	var changeLine;
		// 	if (cell1 > 4.20 || cell1 < 2.90) {
		// 			changeLine = "#FF0000"; // red
		// 		} else if (cell1 > 4.15){
		// 			changeLine = "#FDF22F"; // yellow
		// 		} else if (cell1 >= 2.90) {
		// 			changeLine = "#65E624"; // green
		// 		}

		// 	cellVoltage.addTimeSeries(
		//     	this.component.getModel("cellVoltage").getProperty("/cell1"),
		//     	{ 
		//     		strokeStyle: changeLine, 
		//     		// fillStyle: 'rgba(0, 255, 0, 0.2)', 
		//     		lineWidth: 4 
		//     	});

		//     var changeLine2;
		//     if (cell2 > 4.20 || cell2 < 2.90) {
		// 			changeLine2 = "#FF0000"; // red
		// 		} else if (cell2 > 4.15){
		// 			changeLine2 = "#FDF22F"; // yellow
		// 		} else if (cell2 >= 2.90) {
		// 			changeLine2 = "#65E624"; // green
		// 		}

		// 	cellVoltage.addTimeSeries(
		//     	this.component.getModel("cellVoltage").getProperty("/cell2"),
		//     	{ 
		//     		strokeStyle: changeLine2, 
		//     		// fillStyle: 'rgba(0, 255, 0, 0.2)', 
		//     		lineWidth: 4 
		//     	});
		// },

		magic: function() {
			// Load JSON model
			var jsonModel = "/destinations/McCoy_URE/Overview.xsodata/OVERVIEW?$filter=RACE_ID%20eq%20" + raceID + "%20and%20RUN_ID%20eq%20" +
				runID + "&$orderby=SENSOR_TIMESTAMP%20desc&$top=1&$format=json";

			// Bind existing model to variable
			var liveChart = sap.ui.getCore().getModel("Overview");

			// Load jsonModel URL into variable
			liveChart.loadData(jsonModel);

			// Get property/column to fill line
			var cell1 = liveChart.getProperty("/d/results/0/MIN_CELL_VOLT");
			var cell2 = liveChart.getProperty("/d/results/0/MAX_CELL_VOLT");
			var waterTemp1 = liveChart.getProperty("/d/results/0/WATER_TEMP1");
			var waterTemp2 = liveChart.getProperty("/d/results/0/WATER_TEMP2");

			return [cell1, cell2, waterTemp1, waterTemp2];
		},

		refreshSteer: function() {
			var data = sap.ui.getCore().getModel("Overview");
			var value = data.getProperty("/d/results/0/STEERING");
			value = Math.floor(value);
			var html =
				"<div style=\"width: 100%; height: 100%; background-size: contain; background-image: url('/IMG/steer.png'); background-repeat: no-repeat; background-position: center; -ms-transform: rotate(" +
				value + "deg); /* IE 9 */ -webkit-transform: rotate(" + value +
				"deg); /* Chrome, Safari, Opera */ transition: 300ms linear all; transform: rotate(" + value + "deg);\"></div>";
			var htmlComponent = new sap.ui.core.HTML();
			htmlComponent.setContent(html);
			htmlComponent.placeAt("__xmlview1--OverviewElement--stuuruitslagDiv", "only");
			//var data = sap.ui.getCore().getModel("Overview");
			//debugger;
			var view = document.getElementById("__xmlview1--OverviewElement--eight_curve");
			//alert(view.offsetHeight + " or " + view.clientHeight );

			var middleHeight = view.offsetHeight / 2.
			var middleWidth = view.offsetWidth / 2.
			var percentagePixelHeight = (view.offsetHeight * 0.65) / 100;
			var percentagePixelWidth = (view.offsetWidth * 0.96) / 100;

			//var value =	data.getProperty("/d/results/0/POWER");
			var x = data.getProperty("/d/results/0/ACCELERATION_X");
			var y = data.getProperty("/d/results/0/ACCELERATION_Y");
			/// DEMO 
			//	var x = Math.floor(value_x);
			//	var y = Math.floor(value_y);
			//x = 3;
			//y = -0.5;

			var percent_x = 0;
			var percent_y = 0;
			if (x !== 0) {
				percent_x = ((x / 3) * 100) / 2;
				percent_x = Math.abs(percent_x);
			}
			if (y !== 0) {
				percent_y = ((y / 2) * 100) / 2;
				percent_y = Math.abs(percent_y);
			}

			/*if (x >= 0) {
				percent_x = 50 + percent_x;
			}
			if (y >= 0) {
				percent_y = 50 + percent_y;
			}*/

			if (x >= 0) {
				percent_x = middleWidth - (percent_x * percentagePixelWidth);
			} else {
				percent_x = middleWidth + (percent_x * percentagePixelWidth);
			}

			if (y >= 0) {
				percent_y = middleHeight - (percent_y * percentagePixelHeight);
			} else {
				percent_y = middleHeight + (percent_y * percentagePixelHeight);
			}

			var pixel_y = percent_y;

			var dot = "<div style=\"text-align: left; width: 100%; height: 100%;  background-image: url(/IMG/dot.png); background-position: " +
				percent_x + "px " + pixel_y + "px;  background-repeat: no-repeat;\"></div>";
			var dotComponent = new sap.ui.core.HTML();
			dotComponent.setContent(dot);
			dotComponent.placeAt("__xmlview1--OverviewElement--eight_curve", "only");
		},

		goToCreateTest: function() {
			var router = sap.ui.core.UIComponent.getRouterFor(this);
			router.navTo("CreateTest", null, false);
		}
	});
});