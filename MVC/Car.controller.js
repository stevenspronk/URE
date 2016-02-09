sap.ui.define([
        'sap/ui/core/mvc/Controller',
        'sap/ui/model/json/JSONModel',
        'sap/viz/ui5/controls/common/feeds/FeedItem',
        'sap/viz/ui5/data/FlattenedDataset',
        'sap/viz/ui5/format/ChartFormatter',
        './ControllerOverall'
    ],function(Controller,JSONModel,FeedItem,FlattenedDataset,ChartFormatter,ControllerOverall) {
    "use strict";
    
var TimeAxisController = Controller.extend("MVC.Car", { 
        onInit: function(oEvent) {
            var timeAxisExampleSelect = this.getView().byId("timeAxisExampleSelect");
            var timeAxisChartTypeSelect = this.getView().byId("chartTypeSelect");
            var oVizFrame = this.getView().byId("idVizFrameTimeAxis");
            var oPopOver = this.getView().byId("idPopOver");
            oPopOver.connect(oVizFrame.getVizUid());
            var oPanel1 = this.getView().byId("PN-1");
            var oFixFlex = this.getView().byId("idFixFlex");            
            ControllerOverall.loadLibrary(oVizFrame, oFixFlex);
            ControllerOverall.customFormat(); 
       
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
            oPopOver.setFormatString({"Date":"YearMonthDay","Cost":FIORI_LABEL_FORMAT_2,"Revenue":FIORI_LABEL_FORMAT_2});
            
            var oContainer = this.getView().byId("idContainer");
            var oBox1 = this.getView().byId("BX-1");
//            var oBox2 = this.getView().byId("BX-2");
            var oBox2 = this.getView().byId("BX-2");
            var oHBox = this.getView().byId("HB-1");          
            
            ControllerOverall.adjustStyle(null,null,null,null,null,
                    null,null,null,null,null,oBox1,oBox2,null,null,null,oHBox);
            ControllerOverall.setExpanding(oPanel1);
           /* var generateBubbleChart = function() {
                    oVizFrame.destroyDataset();
                    oVizFrame.destroyFeeds(); 
                    oVizFrame.setUiConfig({
                        "applicationSet": "fiori"
                    });
                    var dataPath = "test-resources/sap/viz/demokit/dataset/milk_production_testing_data/date_revenue_cost/bubble/medium.json";
                    oVizFrame.setVizType('timeseries_bubble');
                    var oModel = new JSONModel(dataPath);
                    var oDataset = new FlattenedDataset({
                        "dimensions": [{
                            "name": "Date",
                            "value": "{Date}",
                            "dataType":"date"
                        }],
                        "measures": [{
                            "name": "Cost",
                            "value": "{Cost}"
                        },
                        {
                            "name": "Revenue",
                            "value": "{Revenue}"
                        }],
                        
                        data: {
                            path: "/milk"
                        }
                    });
                    oVizFrame.setDataset(oDataset);
                    oVizFrame.setModel(oModel);
                    
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
                                visible: true
                            }
                        },
                        plotArea: {
                            dataLabel: {
                                formatString:FIORI_LABEL_SHORTFORMAT_2,
                                visible: false
                            },
                            window: {
                                start: null,
                                end: null
                            }
                        },
                        sizeLegend: {
                            formatString:FIORI_LABEL_SHORTFORMAT_2,
                            title: {
                                visible: true
                            }
                        },
                        title: {
                            visible: false
                        }

                    });
                    var feedValueAxis = new FeedItem({
                        'uid': "valueAxis",
                        'type': "Measure",
                        'values': ["Cost"]
                    }),
                    feedTimeAxis = new FeedItem({
                        'uid': "timeAxis",
                        'type': "Dimension",
                        'values': ["Date"]
                    }),
                    feedBubbleWidth = new FeedItem({
                        "uid": "bubbleWidth",
                        "type": "Measure",
                        "values": ["Revenue"]
                    });

                    oVizFrame.addFeed(feedValueAxis);
                    oVizFrame.addFeed(feedTimeAxis);
                    oVizFrame.addFeed(feedBubbleWidth);
                   
            };

             var generateColumnChart = function() {
                    oVizFrame.destroyDataset();
                    oVizFrame.destroyFeeds();
                    oVizFrame.setUiConfig({
                        "applicationSet": "fiori"
                    });
                    var dataPath = "test-resources/sap/viz/demokit/dataset/milk_production_testing_data/date_revenue_cost/column/medium.json";
                    oVizFrame.setVizType('timeseries_column');
                    oPopOver.connect(oVizFrame.getVizUid());

                    var oModel = new JSONModel(dataPath);
                    var oDataset = new FlattenedDataset({
                       dimensions: [{
                           name: 'Date',
                           value: "{Date}",
                           dataType:'date'
                       }],
                       measures: [{
                           name: 'Cost',
                           value: '{Cost}'
                       }],
                       data: {
                           path: "/milk"
                       }
                    });
                    oVizFrame.setDataset(oDataset);
                    oVizFrame.setModel(oModel);
                    
                    var key = parseInt(timeAxisExampleSelect.getSelectedKey());
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
                        timeAxis: {
                            levelConfig: {
                                "year": {
                                    row: 2
                                }
                            }
                        },
                        plotArea: {
                            dataLabel: {
                                formatString:FIORI_LABEL_SHORTFORMAT_2,
                                visible: false
                            },
                            isFixedDataPointSize: false,
                            window: {
                                start: null,
                                end: null
                            },
                        },
                        legend: {
                            title: {
                                visible: false
                            }
                        },
                        title: {
                            visible: false
                        },
                        interaction: {
                            syncValueAxis: key === 4
                        }

                    });
                    var feedValueAxis = new FeedItem({
                        'uid': "valueAxis",
                        'type': "Measure",
                        'values': ["Cost"]
                    }),
                    feedTimeAxis = new FeedItem({
                        'uid': "timeAxis",
                        'type': "Dimension",
                        'values': ["Date"]
                    });
                    oVizFrame.addFeed(feedValueAxis);
                    oVizFrame.addFeed(feedTimeAxis);

            };*/
                    var generateLineChart = function() { 
                    oVizFrame.destroyDataset();
                    oVizFrame.destroyFeeds();
                    oVizFrame.setUiConfig({
                        "applicationSet": "fiori"
                    });
                   var dataPath = "test-resources/sap/viz/demokit/dataset/milk_production_testing_data/date_revenue_cost/column/large.json";
                    oVizFrame.setVizType('timeseries_line');
                 var oModel = new JSONModel(dataPath);
//   				  var oModel = new sap.ui.model.odata.ODataModel("/destinations/McCoy_URE/UreSensor.xsodata/");
                    var oDataset = new FlattenedDataset({
                        dimensions: [{
                            name: 'Date',
                            value: "{Date}",
                            dataType:'date'
                        }],
                        measures: [{
                            name: 'Revenue',
                            value: '{Revenue}'
                        }],
                        data: {
                            path: "/milk"
                        }
                    });
  /*                   var oDataset = new FlattenedDataset({
                        dimensions: [{
                            name: 'TIMESTAMP',
                            value: "{TIMESTAMP}"
                 //           dataType:'date'
                        }],
                        measures: [{
                            name: 'BATTERYTMAX1',
                            value: '{BATTERYTMAX1}'
                        }],
                        data: {
                            path: "/ZURE_SENSOR1"
                        }
                    });
*/                   oVizFrame.setDataset(oDataset);
                    oVizFrame.setModel(oModel);

                    oVizFrame.setVizProperties({
                        general: {
                            layout: {
                                padding: 0.04
                            }
                        },
                        valueAxis: {
                            visible: true,
                            label: {
                                formatString:FIORI_LABEL_SHORTFORMAT_10
                            },
                            title: {
                                visible: false
                            }
                        },
                        timeAxis: {
                            title: {
                                visible: false
                            },
                           levelConfig: {
                                "year": {
                                    row: 2
                                }
                           },
                            interval : {
                                unit : ''
                            }
                        },
                        plotArea: {
                           window: {
                                start: 1343750400000,
                                end: 1372521600000
                            },
                            dataLabel: {
                                formatString:FIORI_LABEL_SHORTFORMAT_2,
                                visible: false
                            }
                        },
                        legend: {
                            title: {
                                visible: false
                            }
                        },
                        title: {
                            visible: false
                        },
                        interaction: {
                            syncValueAxis: false
                        }
                    });

                    var feedValueAxis = new FeedItem({
                            'uid': "valueAxis",
                            'type': "Measure",
                            'values': ["Revenue"]
                        }),
                        feedTimeAxis = new FeedItem({
                            'uid': "timeAxis",
                            'type': "Dimension",
                            'values': ["Date"]
                        });
                    oVizFrame.addFeed(feedValueAxis);
                    oVizFrame.addFeed(feedTimeAxis);                   
            };

             var generateScatterChart = function() {
                    oVizFrame.destroyDataset();
                    oVizFrame.destroyFeeds();
                    oVizFrame.setUiConfig({
                        "applicationSet": "fiori"
                    });
                    var dataPath = "test-resources/sap/viz/demokit/dataset/milk_production_testing_data/date_revenue_cost/column/large.json";
                    oVizFrame.setVizType('timeseries_scatter');
                    var oModel = new JSONModel(dataPath);
                    var oDataset = new FlattenedDataset({
                       dimensions: [{
                           name: 'Date',
                           value: "{Date}",
                           dataType:'date'
                       }],
                       measures: [{
                           name: 'Cost',
                           value: '{Cost}'
                       }],
                       data: {
                           path: "/milk"
                       }
                    });
                    oVizFrame.setDataset(oDataset);
                    oVizFrame.setModel(oModel);
                    
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
                        plotArea: {
                            dataLabel: {
                                formatString:FIORI_LABEL_SHORTFORMAT_2,
                                visible: false
                            },
                            window: {
                                start: null,
                                end: null
                            }
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
                        'values': ["Cost"]
                    }),
                    feedTimeAxis = new FeedItem({
                        'uid': "timeAxis",
                        'type': "Dimension",
                        'values': ["Date"]
                    });
                    oVizFrame.addFeed(feedValueAxis);
                    oVizFrame.addFeed(feedTimeAxis);
            };
            var initTimeAxisChartTypeSelectEvent=function() {
                timeAxisChartTypeSelect.attachChange(function(){
                      var key = parseInt(timeAxisChartTypeSelect.getSelectedKey());
                      var eKey = parseInt(timeAxisExampleSelect.getSelectedKey());
                      switch(key)
                      {
/*                        case 1:
                            generateBubbleChart();
                            break;
                        case 2:
                            generateColumnChart();
                            break;
                         case 3:
                            generateLineChart();                                                        
                            break;
*/                      case 4:
                            generateLineChart();
                            oVizFrame.setVizProperties({
                                timeAxis: {
                                    levels: eKey === 3 ? ["day", "month", "quarter", "year"] : ["day", "month", "year"],
                                    interval : {
                                        unit : 'minlevel'
                                    }
                                },
                                plotArea: {
                                    window: {
                                        start: null,
                                        end: null
                                    }
                                },
                                interaction: {
                                    syncValueAxis: true
                                }
                            });
                            break;
/*                         case 5:
                            generateScatterChart();
                            break;
*/                      }
                   });
                timeAxisExampleSelect.attachChange(function(){
                    var chart = parseInt(timeAxisChartTypeSelect.getSelectedKey());
                    var key = parseInt(timeAxisExampleSelect.getSelectedKey());
                    switch(key)
                    {
                      case 1:
                          oVizFrame.setVizProperties({
                              timeAxis: {
                                  levels: ["day", "month", "year"],
                                  interval : {
                                      unit : chart === 4 ? 'minlevel' : ''
                                  }
                              }
                          });
                          break;
                      case 2:
                          break;
                      case 3:
                          oVizFrame.setVizProperties({
                              timeAxis: {
                                  levels: ["day", "month", "quarter", "year"],
                                  interval : {
                                      unit : chart === 4 ? 'minlevel' : ''
                                  }
                              }
                          });
                          break;
                    }
                 });
        };
            initTimeAxisChartTypeSelectEvent();
            generateLineChart();
}}
);
    return TimeAxisController;
});