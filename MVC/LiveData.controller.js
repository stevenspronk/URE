sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"com/URE/Controls/smoothie"
], function(Controller) {
	"use strict";

	return Controller.extend("MVC.LiveData", {

		onInit: function() {
			this.component = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this.getView()));
			
			// Get a reference to the model and add a TimeSeries property
			var chartModel = this.component.getModel("chart");

			var me = this;
			
			// Set variables for lines in JSON format
			chartModel.setProperty("/line0", new TimeSeries());
			chartModel.setProperty("/line100", new TimeSeries());
			chartModel.setProperty("/linereference", new TimeSeries());
			chartModel.setProperty("/bucket1", new TimeSeries());
			chartModel.setProperty("/bucket2", new TimeSeries());
			chartModel.setProperty("/bucket3", new TimeSeries());
			chartModel.setProperty("/bucket4", new TimeSeries());
			chartModel.setProperty("/bucket5", new TimeSeries());
			chartModel.setProperty("/bucket6", new TimeSeries());
			
			// Every 200ms a new magical number appears
			setInterval(function() {
				var magicNumber = me.magic();
				var bucket1 = magicNumber[0];
				var bucket2 = magicNumber[1];
				var bucket3 = magicNumber[2];
				var bucket4 = magicNumber[3];
				var bucket5 = magicNumber[4];
				var bucket6 = magicNumber[5];
				chartModel.getProperty("/line0").append(new Date().getTime(), 0);
				chartModel.getProperty("/line100").append(new Date().getTime(), 100);
			//	chartModel.getProperty("/linereference").append(new Date().getTime(), 60);
				chartModel.getProperty("/bucket1").append(new Date().getTime(), bucket1);
				chartModel.getProperty("/bucket2").append(new Date().getTime(), bucket2);
				chartModel.getProperty("/bucket3").append(new Date().getTime(), bucket3);
				chartModel.getProperty("/bucket4").append(new Date().getTime(), bucket4);
				chartModel.getProperty("/bucket5").append(new Date().getTime(), bucket5);
				chartModel.getProperty("/bucket6").append(new Date().getTime(), bucket6);
		    }, 200);
		    
		},
		
		onAfterRendering: function() {
			// Get a reference to the smooty control of the view
			var batteryTemperature = this.byId("batteryTemperature");
			
			// Bind property TimeSeries to the chart
		    batteryTemperature.addTimeSeries(
		    	// Blank 0 line
		    	this.component.getModel("chart").getProperty("/line0"),
		    	{ 
		    		strokeStyle: 'transparant', 
		    		// fillStyle: 'rgba(0, 255, 0, 0.2)', 
		    		lineWidth: 0 
		    	});
		    	
		    batteryTemperature.addTimeSeries(
		    	// Blank 100 line
		    	this.component.getModel("chart").getProperty("/line100"),
		    	{ 
		    		strokeStyle: 'transparant', 
		    		// fillStyle: 'rgba(0, 255, 0, 0.2)', 
		    		lineWidth: 0 
		    	});
		    	
		    batteryTemperature.addTimeSeries(
		    	this.component.getModel("chart").getProperty("/bucket1"),
		    	{ 
		    		strokeStyle: '#E67200', 
		    		// fillStyle: 'rgba(0, 255, 0, 0.2)', 
		    		lineWidth: 4 
		    	});
		    
		    batteryTemperature.addTimeSeries(
		    	this.component.getModel("chart").getProperty("/bucket2"),
		    	{ 
		    		strokeStyle: '#9A4C00', 
		    		// fillStyle: 'rgba(0, 255, 0, 0.2)', 
		    		lineWidth: 4 
		    	});
		    batteryTemperature.addTimeSeries(
		    	this.component.getModel("chart").getProperty("/bucket3"),
		    	{ 
		    		strokeStyle: '#FFCD9D', 
		    		// fillStyle: 'rgba(0, 255, 0, 0.2)', 
		    		lineWidth: 4 
		    	});
		    batteryTemperature.addTimeSeries(
		    	this.component.getModel("chart").getProperty("/bucket4"),
		    	{ 
		    		strokeStyle: '#00769A', 
		    		// fillStyle: 'rgba(0, 255, 0, 0.2)', 
		    		lineWidth: 4 
		    	});
		    batteryTemperature.addTimeSeries(
		    	this.component.getModel("chart").getProperty("/bucket5"),
		    	{ 
		    		strokeStyle: '#00B2E6', 
		    		// fillStyle: 'rgba(0, 255, 0, 0.2)', 
		    		lineWidth: 4 
		    	});
		    batteryTemperature.addTimeSeries(
		    	this.component.getModel("chart").getProperty("/bucket6"),
		    	{ 
		    		strokeStyle: '#00699A', 
		    		// fillStyle: 'rgba(0, 255, 0, 0.2)', 
		    		lineWidth: 4 
		    	});
		    	
		    // Start streaming
		    batteryTemperature.startStreaming(500);
		},
		
		magic: function(){
			// Load JSON model
			var jsonModel = "/destinations/McCoy_URE/Overview.xsodata/OVERVIEW?$filter=RACE_ID%20eq%20" + raceID + "%20and%20RUN_ID%20eq%20" + runID + "&$orderby=SENSOR_TIMESTAMP%20desc&$top=1&$format=json";
			
			// Bind existing model to variable
			var liveChart = sap.ui.getCore().getModel("Overview");
			
			// Load jsonModel URL into variable
			liveChart.loadData(jsonModel);
			
			// Get property/column to fill line
			var bucket1 = liveChart.getProperty("/d/results/0/MAX_TEMP_BUCKET1");
			var bucket2 = liveChart.getProperty("/d/results/0/MAX_TEMP_BUCKET2");
			var	bucket3 = liveChart.getProperty("/d/results/0/MAX_TEMP_BUCKET3");
			var	bucket4 = liveChart.getProperty("/d/results/0/MAX_TEMP_BUCKET4");
			var	bucket5 = liveChart.getProperty("/d/results/0/MAX_TEMP_BUCKET5");
			var	bucket6 = liveChart.getProperty("/d/results/0/MAX_TEMP_BUCKET6");
			
			return [bucket1, bucket2, bucket3, bucket4, bucket5, bucket6];
		}
	});

});