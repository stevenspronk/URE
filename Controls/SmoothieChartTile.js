sap.ui.define([
	"sap/ui/core/Control",
	"com/URE/Controls/smoothie"
], function (Control) {
	"use strict";
	var SmoothieControl = Control.extend("com.URE.Controls.SmoothieChartTile", {

		metadata : {
			properties : {
				chart : { type : "SmoothieChart", defaultValue: new SmoothieChart({minValue:1,maxValue:8,millisPerPixel:67,grid:{fillStyle:'#000000',strokeStyle:'transparent'} }) },
				width : { type : "sap.ui.core.CSSSize", group : "Appearance", defaultValue : null },
				height : { type : "sap.ui.core.CSSSize", group : "Appearance", defaultValue : null }
			}
		},
		
		init : function () {
		},
		
		renderer : function (rm, oControl) {
			rm.write("<div");
			rm.writeControlData(oControl);
			rm.addClass("smoothieChart");
			rm.writeClasses();
			rm.write(">");

			rm.write("<canvas");
			rm.writeAttribute("id", oControl.getId() + "-canvas");
			rm.writeAttribute("width", oControl.getWidth());
			rm.writeAttribute("height", oControl.getHeight());

			if (oControl.getWidth() && oControl.getWidth() != '') {
				rm.addStyle("width", oControl.getWidth());
			}
			if (oControl.getHeight() && oControl.getHeight() != '') {
				rm.addStyle("height", oControl.getHeight());
			}
			rm.writeStyles();
		
			rm.writeClasses();
			rm.write(">");
			rm.write("</canvas>");

			rm.write("</div>");
		}
		
	});

	SmoothieControl.prototype.addTimeSeries = function(timeSeries, options) {
		this.getChart().addTimeSeries(timeSeries, options);	
	};
	
	SmoothieControl.prototype.startStreaming = function(delayMillis) {
		this.getChart().streamTo(this.getDomRef().childNodes[0], delayMillis);
	};
	
	return SmoothieControl;
	
});