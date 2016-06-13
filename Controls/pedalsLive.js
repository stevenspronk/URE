sap.ui.define([
	"sap/ui/core/Control",
	"com/URE/Controls/smoothie"
], function (Control) {
	"use strict";
	var SmoothieControl = Control.extend("com.URE.Controls.pedalsLive", {

		metadata : {
			properties : {
				chart : { type : "SmoothieChart", defaultValue: new SmoothieChart({millisPerPixel:100,grid:{fillStyle:'#ffffff', verticalSections: 2},labels:{fillStyle:'#000000',fontFamily:"Arial",fontSize:14,precision:4},timestampFormatter:SmoothieChart.timeFormatter}) },
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
	
	SmoothieControl.prototype.startStreaming = function(canvas, delayMillis) {
		this.getChart().streamTo(this.getDomRef().childNodes[0], delayMillis);
	};
	
	return SmoothieControl;
	
});