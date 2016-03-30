sap.ui.define([
        'sap/ui/core/mvc/Controller',
        'sap/ui/model/json/JSONModel',
        'sap/viz/ui5/controls/common/feeds/FeedItem',
        'sap/viz/ui5/data/FlattenedDataset',
        'sap/viz/ui5/format/ChartFormatter',
        './ControllerOverall'
    ], function(Controller,JSONModel,FeedItem,FlattenedDataset,ChartFormatter,ControllerOverall) {
    "use strict";

     var LineController = Controller.extend("MVC.Car", {
        onInit: function(oEvent) { 
            var oVizFrame = this.getView().byId("idVizFrameLine");
            var oFixFlex = this.getView().byId("idFixFlex");
            ControllerOverall.customFormat(); // set customized format
            ControllerOverall.loadLibrary(oVizFrame, oFixFlex); // load "sap.suite.ui.commons"
            
            var oVizFrame = this.getView().byId("idVizFrameLine");  
            oVizFrame.setVizType('line');
            oVizFrame.setUiConfig({
                "applicationSet": "fiori" 
            });
            // Use UI5 formatter
            var FIORI_LABEL_SHORTFORMAT_10 = "__UI5__ShortIntegerMaxFraction10";
            var FIORI_LABEL_FORMAT_2 = "__UI5__FloatMaxFraction2";
            var FIORI_LABEL_SHORTFORMAT_2 = "__UI5__ShortIntegerMaxFraction2";
            var chartFormatter = ChartFormatter.getInstance();
            chartFormatter.registerCustomFormatter(FIORI_LABEL_SHORTFORMAT_10, function(value) {
                var fixedInteger = sap.ui.core.format.NumberFormat.getIntegerInstance({style: "short",
                    maxFractionDigits: 10});
                return fixedInteger.format(value);
            });
            chartFormatter.registerCustomFormatter(FIORI_LABEL_FORMAT_2, function(value) {
                var fixedFloat = sap.ui.core.format.NumberFormat.getFloatInstance({style: 'Standard',
                    maxFractionDigits: 2});
                return fixedFloat.format(value);
            });
            chartFormatter.registerCustomFormatter(FIORI_LABEL_SHORTFORMAT_2, function(value) {
                var fixedInteger = sap.ui.core.format.NumberFormat.getIntegerInstance({style: "short",
                    maxFractionDigits: 2});
                return fixedInteger.format(value);
            });
            sap.viz.api.env.Format.numericFormatter(chartFormatter);
            
            var oPopOver = this.getView().byId("idPopOver");
            oPopOver.connect(oVizFrame.getVizUid());
            oPopOver.setFormatString(FIORI_LABEL_FORMAT_2);
           
//            var dataPath = "https://webidetesting1843786-p1940830713trial.dispatcher.hanatrial.ondemand.com/destinations/McCoy_URE/UreSensor.xsodata";
//			var oDataModel = new sap.ui.model.odata.ODataModel("/destinations/McCoy_URE/UreSensor.xsodata/");
			var dataPath = "test-resources/sap/viz/demokit/dataset/milk_production_testing_data/revenue_cost_consume";
//			var oModel = new JSONModel(oDataModel.getData());
//			var oModelS = new JSONModel(oDataModel.getData());
//			var oModelL = new JSONModel(oDataModel.getData());
			
//            var oModel = new JSONModel(dataPath);
//			var oModelS = new JSONModel(dataPath);
//            var oModelL = new JSONModel(dataPath);
           
           
//            var oModel = new JSONModel(dataPath + "/medium.json");
//            var oModelS = new JSONModel(dataPath + "/small.json");
            var oModelL = new JSONModel(dataPath + "/large.json");
            
/*            var oDataset = new FlattenedDataset({
                dimensions: [{
                    name: 'TIMESTAMP',
                    value: "{TIMESTAMP}"
                }],
                measures: {
                    name: 'SENSORVALUE',
                    value: '{SENSORVALUE}'
                }, 
                data: {
                    path: "/ZURE_SENSOR1"
                }
            });
*/
            var oDataset = new FlattenedDataset({
                dimensions: [{
                    name: 'Store Name',
                    value: "{Store Name}"
                }],
                measures: [{
                    name: 'Revenue',
                    value: '{Revenue}'
                }, {
                    name: 'Cost',
                    value: '{Cost}'
                }],
                data: {
                    path: "/milk"
                }
            });


            oVizFrame.setDataset(oDataset);
            oVizFrame.setModel(oModelL);

            oVizFrame.setVizProperties({
                general: {
                    layout: {
                        padding: 0.04
                    }
                },
                valueAxis: {
                    label: {
                        formatString:FIORI_LABEL_SHORTFORMAT_10
                    },
                    title: {
                        visible: true
                    }
                },
                categoryAxis: {
                    title: {
                        visible: true
                    }
                },
                plotArea: {
                    dataLabel: {
                        visible: true,
                        formatString:FIORI_LABEL_SHORTFORMAT_2
                    },
                },
                legend: {
                    title: {
                        visible: true
                    }
                },
                title: {
                    visible: true,
                }
            });        
/*            var feedValueAxis = new FeedItem({
                    'uid': "valueAxis",
                    'type': "TIMESTAMP",
                    'values': ["TIMESTAMP"]
                }),
                feedCategoryAxis = new FeedItem({
                    'uid': "categoryAxis",
                    'type': "Dimension",
                    'values': ["SENSORVALUE"]
                });
*/                
            var feedValueAxis = new FeedItem({
                    'uid': "valueAxis",
                    'type': "Measure",
                    'values': ["Revenue"]
                }),
                feedCategoryAxis = new FeedItem({
                    'uid': "categoryAxis",
                    'type': "Dimension",
                    'values': ["Store Name"]
                });
            oVizFrame.addFeed(feedValueAxis);
            oVizFrame.addFeed(feedCategoryAxis);
     }
    });

    return LineController;

});