sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel',
	'sap/viz/ui5/controls/common/feeds/FeedItem',
	'sap/viz/ui5/data/FlattenedDataset',
	'sap/viz/ui5/format/ChartFormatter',
	'MVC/CustomerFormat',
	'MVC/ControllerOverall'
], function(Controller, JSONModel, FeedItem, FlattenedDataset, ChartFormatter, CustomerFormat, ControllerOverall) {
	"use strict";
 
	var LineController = Controller.extend("MVC.Driver", {

		settingsModel: {
			series: {
				name: "Analyse",
				defaultSelected: 0,
				values: [{
					name: "Stand van de pedalen",
					value: ["BRAKE", "TROTTLE"]
				}, {
					name: "Acceleratie",
					value: ["ACCELERATION_X", "ACCELERATION_Y", "ACCELERATION_Z"]
				}]
			},
			dataLabel: {
				name: "Waarden tonen",
				defaultState: false
			}
		},

		oVizFrame: null,

		onInit: function(oEvent) {
			var sModel = new JSONModel(this.settingsModel);
			sModel.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);
			this.getView().setModel(sModel);

			var oVizFrame = this.oVizFrame = this.getView().byId("idVizFrame");
			var oFixFlex = this.getView().byId("idFixFlex");
			ControllerOverall.customFormat(); // set customized format
			ControllerOverall.loadLibrary(oVizFrame, oFixFlex); // load "sap.suite.ui.commons"

			// oVizFrame.setVizType('line');
			// oVizFrame.setUiConfig({
			// 	"applicationSet": "fiori"
			// });
			// // Use UI5 formatter
			// var FIORI_LABEL_SHORTFORMAT_10 = "__UI5__ShortIntegerMaxFraction10";
			// var FIORI_LABEL_FORMAT_2 = "__UI5__FloatMaxFraction2";
			// var FIORI_LABEL_SHORTFORMAT_2 = "__UI5__ShortIntegerMaxFraction2";
			// var chartFormatter = ChartFormatter.getInstance();
			// chartFormatter.registerCustomFormatter(FIORI_LABEL_SHORTFORMAT_10, function(value) {
			// 	var fixedInteger = sap.ui.core.format.NumberFormat.getIntegerInstance({
			// 		style: "short",
			// 		maxFractionDigits: 10
			// 	});
			// 	return fixedInteger.format(value);
			// });
			// chartFormatter.registerCustomFormatter(FIORI_LABEL_FORMAT_2, function(value) {
			// 	var fixedFloat = sap.ui.core.format.NumberFormat.getFloatInstance({
			// 		style: 'Standard',
			// 		maxFractionDigits: 2
			// 	});
			// 	return fixedFloat.format(value);
			// });
			// chartFormatter.registerCustomFormatter(FIORI_LABEL_SHORTFORMAT_2, function(value) {
			// 	var fixedInteger = sap.ui.core.format.NumberFormat.getIntegerInstance({
			// 		style: "short",
			// 		maxFractionDigits: 2
			// 	});
			// 	return fixedInteger.format(value);
			// });
			// sap.viz.api.env.Format.numericFormatter(chartFormatter);

			var oModel = sap.ui.getCore().getModel("ID");
			raceID = oModel.oData.raceID;
			runID = oModel.oData.runID;

			var url = "/destinations/McCoy_URE/Overview.xsodata/OVERVIEW?$format=json&$filter=RACE_ID eq " + raceID + " and RUN_ID eq " + runID;
			var carModel = new sap.ui.model.json.JSONModel(url);

			sap.ui.getCore().setModel(carModel, "RaceData");
			this.getView().setModel(carModel, "RaceData");

			// var oDataset = new FlattenedDataset({
			// 	dimensions: [{
			// 		name: 'SENSOR_TIMESTAMP',
			// 		value: "{SENSOR_TIMESTAMP}",
			// 	}],
			// 	measures: [{
			// 		name: 'MAX_TEMP_BUCKET1',
			// 		value: '{MAX_TEMP_BUCKET1}'
			// 	}, {
			// 		name: 'MAX_TEMP_BUCKET2',
			// 		value: '{MAX_TEMP_BUCKET2}'
			// 	}],
			// 	data: {
			// 		path: "/d/results"
			// 	}
			// });

			oVizFrame.setVizProperties({
				// general: {
				// 	layout: {
				// 		padding: 0.04
				// 	}
				// },
				plotArea: {
					dataLabel: {
						formatString: CustomerFormat.FIORI_LABEL_SHORTFORMAT_2,
						visible: false
					}
				},
				valueAxis: {
					label: {
						formatString: CustomerFormat.FIORI_LABEL_SHORTFORMAT_10
					},
					title: {
						visible: false
					}
				},
				categoryAxis: {
					title: {
						visible: false
					}
				},
				// legend: {
				// 	title: {
				// 		visible: true,
				// 		text: "text4"
				// 	}
				// },
				title: {
					visible: true,
					text: "Analyse"
				}
			});

			// oVizFrame.setDataset(oDataset);
			oVizFrame.setModel(carModel);

			var oPopOver = this.getView().byId("idPopOver");
			oPopOver.connect(oVizFrame.getVizUid());
			oPopOver.setFormatString(CustomerFormat.FIORI_LABEL_FORMAT_2);

			// var feedValueAxis = new FeedItem({
			// 		'uid': "valueAxis",
			// 		'type': "Measure",
			// 		'values': ["MAX_TEMP_BUCKET1"]
			// 	}),

			// 	feedCategoryAxis = new FeedItem({
			// 		'uid': "categoryAxis",
			// 		'type': "Dimension",
			// 		'values': ["SENSOR_TIMESTAMP"]
			// 	});

			// oVizFrame.addFeed(feedValueAxis);
			// oVizFrame.addFeed(feedCategoryAxis);
		},

		onSeriesSelected: function(oEvent) {
			var seriesRadio = oEvent.getSource();
			if (this.oVizFrame && seriesRadio.getSelected()) {
				var bindValue = seriesRadio.getBindingContext().getObject();

				var feedValueAxis = this.getView().byId("valueAxisFeed");
				this.oVizFrame.removeFeed(feedValueAxis);
				feedValueAxis.setValues(bindValue.value);
				this.oVizFrame.addFeed(feedValueAxis);
			}
		},
		onDataLabelChanged: function(oEvent) {
			if (this.oVizFrame) {
				this.oVizFrame.setVizProperties({
					plotArea: {
						dataLabel: {
							visible: oEvent.getParameter('state')
						}
					}
				});
			}
		},
		onAfterRendering: function() {
			// function refreshData() {
			// 	var curl = "/destinations/McCoy_URE/Overview.xsodata/OVERVIEW?$format=json&$filter=RACE_ID eq " + raceID + " and RUN_ID eq " + runID;
			// 		var carModel = sap.ui.getCore().getModel("RaceData");
			// 		carModel.loadData(curl);
			// }

			// setTimeout(function() {
			// 	setInterval(function() {
			// 		refreshData();
			// 	}, 1000);
			// }, 1000);

			var seriesRadioGroup = this.getView().byId('seriesRadioGroup');
			seriesRadioGroup.setSelectedIndex(this.settingsModel.series.defaultSelected);
		},

		initCustomFormat: function() {
			CustomerFormat.registerCustomFormat();
		}

	});

	return LineController;

});