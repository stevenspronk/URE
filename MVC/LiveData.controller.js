sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"com/URE/Controls/smoothie"
], function(Controller) {
	"use strict";

	return Controller.extend("MVC.LiveData", {

		onInit: function() {
			// debugger;
			// this.component = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this.getView()));
			
			// // Get a reference to the model and add a TimeSeries property
			// var chartModel = this.component.getModel("chart");
			// chartModel.setProperty("/random", new TimeSeries());

			// // Every 500ms a new random number between 0 and 10,000 is added to the time series
			// setInterval(function() {
		 //       chartModel.getProperty("/random").append(new Date().getTime(), Math.random() * 10000);
		 //   }, 500);
		    
		},
		
		onAfterRendering: function() {
			
			// Get a reference to the smooty control
			// var control = this.byId("awesome");
			
			// // Bind the random TimeSeries to the chart
		 //   control.addTimeSeries(
		 //   	this.component.getModel("chart").getProperty("/random"), 
		 //   	{ 
		 //   		strokeStyle: 'rgba(0, 255, 0, 1)', 
		 //   		fillStyle: 'rgba(0, 255, 0, 0.2)', 
		 //   		lineWidth: 4 
		 //   	});
		    	
		 //   // Start streaming
		 //   control.startStreaming();
		}

	});

});

// jQuery.sap.registerModulePath("smoothie", "JS/");
// jQuery.sap.require("smoothie");

// sap.ui.define(["JS/smoothie"], function(smoothie) {
// 	"use strict";
// 	return sap.ui.controller("MVC.LiveData", {

// 		onInit: function() {
// 			debugger;
// 			var chart = new smoothie.SmoothieChart();
// 			chart.streamTo(document.getElementById("mycanvas"));

// 			// Data
// 			var line1 = new smoothie.TimeSeries();
// 			var line2 = new smoothie.TimeSeries();

// 			// Add a random value to each line every second
// 			setInterval(function() {
// 				line1.append(new Date().getTime(), Math.random());
// 				line2.append(new Date().getTime(), Math.random());
// 			}, 1000);

// 			// Add to SmoothieChart
// 			smoothie.addTimeSeries(line1);
// 			smoothie.addTimeSeries(line2);
// 		},

// 		onAfterRendering: function() {

// 		}

// 	});
// });var chartFormatter = ChartFormatter.getInstance();