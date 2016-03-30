sap.ui.define([
        'sap/ui/core/mvc/Controller',
        'sap/ui/model/json/JSONModel',
        'sap/viz/ui5/controls/common/feeds/FeedItem',
        'sap/viz/ui5/data/FlattenedDataset',
        'sap/viz/ui5/format/ChartFormatter',
        './ControllerOverall'
    ], function(Controller, JSONModel, FeedItem, FlattenedDataset, ChartFormatter, ControllerOverall) {
    "use strict";

    var LineController = Controller.extend("MVC.Driver", {
        onInit: function(oEvent) { 
            var oVizFrame = this.getView().byId("idVizFrameLine");
            var oFixFlex = this.getView().byId("idFixFlex");
            ControllerOverall.customFormat(); // set customized format
            ControllerOverall.loadLibrary(oVizFrame, oFixFlex); // load "sap.suite.ui.commons"

            var dataPath = "test-resources/sap/viz/demokit/dataset/milk_production_testing_data/revenue_cost_consume";
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

            var oModel = new JSONModel(dataPath + "/medium.json");
            var oModelS = new JSONModel(dataPath + "/small.json");
            var oModelL = new JSONModel(dataPath + "/large.json");
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
                        visible: false
                    }
                },
                categoryAxis: {
                    title: {
                        visible: false
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
                        visible: false
                    }
                },
                title: {
                    visible: false,
                }
            });        

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

            var oPanel1 = this.getView().byId("PN-1");
            var oContainer = this.getView().byId("idContainer");
            var oRadio1 = this.getView().byId("RB1-1");
            var oRadio2 = this.getView().byId("RB1-2");
            var oRadio3 = this.getView().byId("RB1-3");
            var oRadio4 = this.getView().byId("RB2-1");
            var oRadio5 = this.getView().byId("RB2-2");
            var oSwitch1 = this.getView().byId("SW-1");
            var oSwitch2 = this.getView().byId("SW-2");
            var oBox1 = this.getView().byId("BX-1");
            var oBox2 = this.getView().byId("BX-2");
            var oBox3 = this.getView().byId("BX-3");
            var oHBox = this.getView().byId("HB-1");

            ControllerOverall.adjustStyle(oRadio1,oRadio2,oRadio3,oRadio4,oRadio5,
                null,null,null,null,null,oBox1,oBox2,oBox3,null,null,oHBox); // adjust style class to RTL mode
            ControllerOverall.setExpanding(oPanel1); // set automatic expanding of setting panel

            // buttons control
            oRadio1.attachSelect(function(oEvent) {
                if(oEvent.getParameters().selected) {
                    oVizFrame.setModel(oModelS);
                }
            });
            oRadio2.attachSelect(function(oEvent) {
                if(oEvent.getParameters().selected) {
                    oVizFrame.setModel(oModel);
                }
            });
            oRadio3.attachSelect(function(oEvent) {
                if(oEvent.getParameters().selected) {
                    oVizFrame.setModel(oModelL);
                }
            });
            oRadio4.attachSelect(function(oEvent) {
                if(oEvent.getParameters().selected) {
                    oVizFrame.removeFeed(feedValueAxis);
                    feedValueAxis = new FeedItem({
                        'uid': "valueAxis",
                        'type': "Measure",
                        'values': ["Revenue"]
                    });
                    oVizFrame.addFeed(feedValueAxis);
                }
            });
            oRadio5.attachSelect(function(oEvent) {
                if(oEvent.getParameters().selected) {
                    oVizFrame.removeFeed(feedValueAxis);
                    feedValueAxis = new FeedItem({
                        'uid': "valueAxis",
                        'type': "Measure",
                        'values': ["Revenue", "Cost"]
                    });
                    oVizFrame.addFeed(feedValueAxis);
                }
            });
            oSwitch1.attachChange(function() {
                if(this.getState()) {
                    oVizFrame.setVizProperties({
                        plotArea: {
                            dataLabel: {
                                visible: true
                            }
                        }
                    });
                }
                if(!this.getState()) {
                    oVizFrame.setVizProperties({
                        plotArea: {
                            dataLabel: {
                                visible: false
                            }
                        }
                    });
                }
            });
            oSwitch2.attachChange(function() {
                if(this.getState()) {
                    oVizFrame.setVizProperties({
                        valueAxis: {
                            title: {
                                visible: true
                            }
                        },
                        categoryAxis: {
                            title: {
                                visible: true
                            }
                        }
                    });
                }
                if(!this.getState()) {
                    oVizFrame.setVizProperties({
                        valueAxis: {
                            title: {
                                visible: false
                            }
                        },
                        categoryAxis: {
                            title: {
                                visible: false
                            }
                        }
                    });
                }
            });
        }
    });

    return LineController;

});
