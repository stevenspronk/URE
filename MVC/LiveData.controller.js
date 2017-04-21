sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"com/URE/Controls/smoothie"
], function(Controller) {
	"use strict";

	return Controller.extend("MVC.LiveData", {

		onInit: function() {
			this.component = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this.getView()));
			
			// Get a reference to the model and add a TimeSeries property
			var test = new sap.ui.model.json.JSONModel();
			var batteryModel =  this.component.getModel("batteryModel");
			var pedalsModel = this.component.getModel("pedalsModel");
			var accelerationModel = this.component.getModel("accelerationModel");
			var waterModel = this.component.getModel("waterModel");

			var me = this;
			
			// Set variables for lines in JSON format
			// chartModel.setProperty("/line0", new TimeSeries());
			// chartModel.setProperty("/line100", new TimeSeries());
			batteryModel.setProperty("/linereference", new TimeSeries());
			batteryModel.setProperty("/bucket1", new TimeSeries());
			batteryModel.setProperty("/bucket2", new TimeSeries());
			batteryModel.setProperty("/bucket3", new TimeSeries());
			batteryModel.setProperty("/bucket4", new TimeSeries());
			batteryModel.setProperty("/bucket5", new TimeSeries());
			batteryModel.setProperty("/bucket6", new TimeSeries());
			pedalsModel.setProperty("/throttle", new TimeSeries());
			pedalsModel.setProperty("/brake", new TimeSeries());
			accelerationModel.setProperty("/accelx", new TimeSeries());
			accelerationModel.setProperty("/accely", new TimeSeries());
			waterModel.setProperty("/water1", new TimeSeries());
			waterModel.setProperty("/water2", new TimeSeries());
			
			// Every 200ms a new magical number appears
			if (crudTest !== "R") {
				
				
				
			var refreshInterval = setInterval(function() {
				var magicNumber = me.magic();
				var bucket1 = magicNumber[0];
				var bucket2 = magicNumber[1];
				var bucket3 = magicNumber[2];
				var bucket4 = magicNumber[3];
				var bucket5 = magicNumber[4];
				var bucket6 = magicNumber[5];
				var throttle = magicNumber[6];
				var brake = magicNumber[7];
				var accelx = magicNumber[8];
				var accely = magicNumber[9];
				var water1 = magicNumber[10];
				var water2 = magicNumber[11];
				
				// chartModel.getProperty("/line0").append(new Date().getTime(), 0);
				// chartModel.getProperty("/line100").append(new Date().getTime(), 100);
				batteryModel.getProperty("/linereference").append(new Date().getTime(), 61);
				batteryModel.getProperty("/bucket1").append(new Date().getTime(), bucket1);
				batteryModel.getProperty("/bucket2").append(new Date().getTime(), bucket2);
				batteryModel.getProperty("/bucket3").append(new Date().getTime(), bucket3);
				batteryModel.getProperty("/bucket4").append(new Date().getTime(), bucket4);
				batteryModel.getProperty("/bucket5").append(new Date().getTime(), bucket5);
				batteryModel.getProperty("/bucket6").append(new Date().getTime(), bucket6);
				pedalsModel.getProperty("/throttle").append(new Date().getTime(), throttle);
				pedalsModel.getProperty("/brake").append(new Date().getTime(), brake);
				accelerationModel.getProperty("/accelx").append(new Date().getTime(), accelx);
				accelerationModel.getProperty("/accely").append(new Date().getTime(), accely);
				waterModel.getProperty("/water1").append(new Date().getTime(), water1);
				waterModel.getProperty("/water2").append(new Date().getTime(), water2);
				
				if (crudTest !== "U"){
						clearInterval(refreshInterval);
					}
					
		    }, 200);
			}
		},
		
		onAfterRendering: function() {
			// Get a reference to the smooty control of the view
			var batteryTemperatureLive = this.byId("batteryTemperature");
			var pedalsLive = this.byId("pedalsChart");
			var accelerationLive = this.byId("accelerationChart");
			var waterTemperatureLive = this.byId("waterTemperature");
			
			// Bind property TimeSeries to the chart
		    // batteryTemperature.addTimeSeries(
		    // 	// Blank 0 line
		    // 	this.component.getModel("chart").getProperty("/line0"),
		    // 	{ 
		    // 		strokeStyle: 'transparant', 
		    // 		// fillStyle: 'rgba(0, 255, 0, 0.2)', 
		    // 		lineWidth: 0 
		    // 	});
		    	
		    batteryTemperatureLive.addTimeSeries(
		    	// Blank 100 line
		    	this.component.getModel("batteryModel").getProperty("/linereference"),
		    	{ 
		    		strokeStyle: '#E93F28', 
		    		// fillStyle: 'rgba(0, 255, 0, 0.2)', 
		    		lineWidth: 0 
		    	});
		    	
		    batteryTemperatureLive.addTimeSeries(
		    	this.component.getModel("batteryModel").getProperty("/bucket1"),
		    	{ 
		    		strokeStyle: '#E67200', 
		    		// fillStyle: 'rgba(0, 255, 0, 0.2)', 
		    		lineWidth: 2 
		    	});
		    
		    batteryTemperatureLive.addTimeSeries(
		    	this.component.getModel("batteryModel").getProperty("/bucket2"),
		    	{ 
		    		strokeStyle: '#9A4C00', 
		    		// fillStyle: 'rgba(0, 255, 0, 0.2)', 
		    		lineWidth: 2 
		    	});
		    batteryTemperatureLive.addTimeSeries(
		    	this.component.getModel("batteryModel").getProperty("/bucket3"),
		    	{ 
		    		strokeStyle: '#FFCD9D', 
		    		// fillStyle: 'rgba(0, 255, 0, 0.2)', 
		    		lineWidth: 2 
		    	});
		    batteryTemperatureLive.addTimeSeries(
		    	this.component.getModel("batteryModel").getProperty("/bucket4"),
		    	{ 
		    		strokeStyle: '#00769A', 
		    		// fillStyle: 'rgba(0, 255, 0, 0.2)', 
		    		lineWidth: 2 
		    	});
		    batteryTemperatureLive.addTimeSeries(
		    	this.component.getModel("batteryModel").getProperty("/bucket5"),
		    	{ 
		    		strokeStyle: '#00B2E6', 
		    		// fillStyle: 'rgba(0, 255, 0, 0.2)', 
		    		lineWidth: 2 
		    	});
		    batteryTemperatureLive.addTimeSeries(
		    	this.component.getModel("batteryModel").getProperty("/bucket6"),
		    	{ 
		    		strokeStyle: '#00699A', 
		    		// fillStyle: 'rgba(0, 255, 0, 0.2)', 
		    		lineWidth: 2 
		    	});
		    	
		     pedalsLive.addTimeSeries(
		    	this.component.getModel("pedalsModel").getProperty("/throttle"),
		    	{ 
		    		strokeStyle: '#78F30F', 
		    		// fillStyle: 'rgba(0, 255, 0, 0.2)', 
		    		lineWidth: 2 
		    	});
		     pedalsLive.addTimeSeries(
		    	this.component.getModel("pedalsModel").getProperty("/brake"),
		    	{ 
		    		strokeStyle: '#F30003', 
		    		// fillStyle: 'rgba(0, 255, 0, 0.2)', 
		    		lineWidth: 2 
		    	});
		    	
		      accelerationLive.addTimeSeries(
		    	this.component.getModel("accelerationModel").getProperty("/accelx"),
		    	{ 
		    		strokeStyle: '#00E68D', 
		    		// fillStyle: 'rgba(0, 255, 0, 0.2)', 
		    		lineWidth: 2 
		    	});
		      accelerationLive.addTimeSeries(
		    	this.component.getModel("accelerationModel").getProperty("/accely"),
		    	{ 
		    		strokeStyle: '#1298B3', 
		    		// fillStyle: 'rgba(0, 255, 0, 0.2)', 
		    		lineWidth: 2 
		    	});
		    
		      waterTemperatureLive.addTimeSeries(
		    	this.component.getModel("waterModel").getProperty("/water1"),
		    	{ 
		    		strokeStyle: '#00A7FD', 
		    		// fillStyle: 'rgba(0, 255, 0, 0.2)', 
		    		lineWidth: 2 
		    	});
		      waterTemperatureLive.addTimeSeries(
		    	this.component.getModel("waterModel").getProperty("/water2"),
		    	{ 
		    		strokeStyle: '#00E0F3', 
		    		// fillStyle: 'rgba(0, 255, 0, 0.2)', 
		    		lineWidth: 2 
		    	});
		    
		    	
		    // Start streaming
		    batteryTemperatureLive.startStreaming("batteryTemperature", 500);
		    pedalsLive.startStreaming("pedalsChart", 500);
		    accelerationLive.startStreaming("accelerationChart", 500);
		    waterTemperatureLive.startStreaming("waterTemperature", 500);
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
			var	throttle = liveChart.getProperty("/d/results/0/THROTTLE");
			var	brake = liveChart.getProperty("/d/results/0/BRAKE");
			var	accelx = liveChart.getProperty("/d/results/0/ACCELERATION_X");
			var	accely = liveChart.getProperty("/d/results/0/ACCELERATION_Y");
			var	water1 = liveChart.getProperty("/d/results/0/WATER_TEMP1");
			var	water2 = liveChart.getProperty("/d/results/0/WATER_TEMP2");
			
			return [bucket1, bucket2, bucket3, bucket4, bucket5, bucket6, throttle, brake, accelx, accely, water1, water2];
		}
	});

});