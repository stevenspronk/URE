sap.ui.define([], function() {
    return {
        customFormat: function() {
        	// use ui5 formatter for chart
            // 'axisFormat' and 'datalabelFormat' formatstring in properties is processed by ui5 formatter
            var customFormatter = {
                format : function(value, pattern) {
                    var formattedString = value;
                    if(pattern == "datalabelFormat") {   
                        if(value > 1) {
                            var datalabelFormat = sap.ui.core.format.FileSizeFormat.getInstance();
                            datalabelFormat.oNumberFormat.oFormatOptions.maxFractionDigits = 2;
                            formattedString = datalabelFormat.format(value);
                            formattedString = formattedString.substring(0,formattedString.length-1);
                        }
                        else if(value < 1) {
                            var datalabelFormatPercent = sap.ui.core.format.NumberFormat.getPercentInstance();
                            datalabelFormatPercent.oFormatOptions.maxFractionDigits = 2;
                            formattedString = datalabelFormatPercent.format(value);
                        }
                    } else if(pattern == "axisFormat") {    
                        if(value > 1) {
                            var axisFormat = sap.ui.core.format.FileSizeFormat.getInstance();
                            axisFormat.oNumberFormat.oFormatOptions.maxFractionDigits = 1;
                            formattedString = axisFormat.format(value);
                            formattedString = formattedString.substring(0,formattedString.length-1);
                        }
                        else if(value < 1) {
                            var axisFormatPercent = sap.ui.core.format.NumberFormat.getPercentInstance();
                            formattedString = axisFormatPercent.format(value);
                        }
                    }
                    else {
                        if(value > 1) {
                            formattedString = value;
                        }
                        else if(value < 1) {
                            var popoverFormatPercent = sap.ui.core.format.NumberFormat.getPercentInstance();
                            popoverFormatPercent.oFormatOptions.maxFractionDigits = 2;
                            formattedString = popoverFormatPercent.format(value);
                        }
                    }
                    if(value == 0) {
                        formattedString = "0";
                    }
                    if(value == 1) {
                        formattedString = "100%"
                    }
                    return formattedString;
                }
            };
            jQuery.sap.require("sap.ui.core.format.DateFormat");
            jQuery.sap.require("sap.ui.core.format.FileSizeFormat");
            jQuery.sap.require("sap.ui.core.format.NumberFormat");
            sap.viz.api.env.Format.numericFormatter(customFormatter);
        },

        loadLibrary: function(vizframe, fixflex) {
            // try to load sap.suite.ui.commons for using ChartContainer
            // sap.suite.ui.commons is available in sapui5-sdk-dist but not in demokit
            var bSuiteAvailable = jQuery.sap.sjax({type: "HEAD", url: sap.ui.resource("sap.suite.ui.commons", "library.js")}).success;
            if (bSuiteAvailable) {
                sap.ui.getCore().loadLibrary("sap.suite.ui.commons")
                var oChartContainerContent = new sap.suite.ui.commons.ChartContainerContent({
                    icon : "sap-icon://horizontal-bar-chart",
                    title : "vizFrame Bar Chart Sample",
                    content : [vizframe]
                });
                var oChartContainer = new sap.suite.ui.commons.ChartContainer({
                    content : [oChartContainerContent]
                });
                oChartContainer.setShowFullScreen(true);
                oChartContainer.setAutoAdjustHeight(true);
                fixflex.destroyFlexContent();
                fixflex.setFlexContent(oChartContainer);
            }   
        },

        setExpanding: function(panel) {
            if (jQuery(document).width() < 550) {
                panel.setExpanded(false);
            }
            jQuery(window).resize(function() {
                if (jQuery(document).width() < 550) {
                    panel.setExpanded(false);
                } else {
                    panel.setExpanded(true);
                }
            });
        },

        adjustStyle: function(oRadio1,oRadio2,oRadio3,oRadio4,oRadio5,oRadio6,oRadio7,oRadio8,oRadio9,oRadio10,oBox1,oBox2,oBox3,oBox4,oBox5,oHBox) {
            try {
                if (jQuery("html").attr("dir") == "rtl") {
                    if (oRadio1) {
                        oRadio1.removeStyleClass("buttonPosition");
                        oRadio1.addStyleClass("buttonPositionRTL");
                    }
                    if (oRadio2) {
                        oRadio2.removeStyleClass("buttonPosition");
                        oRadio2.addStyleClass("buttonPositionRTL");
                    }
                    if (oRadio3) {
                        oRadio3.removeStyleClass("buttonPosition");
                        oRadio3.addStyleClass("buttonPositionRTL");
                    } 
                    if (oRadio4) {
                        oRadio4.removeStyleClass("buttonPosition");
                        oRadio4.addStyleClass("buttonPositionRTL");
                    }
                    if (oRadio5) {
                        oRadio5.removeStyleClass("buttonPosition");
                        oRadio5.addStyleClass("buttonPositionRTL");
                    }
                    if (oRadio6) {
                        oRadio6.removeStyleClass("buttonPosition");
                        oRadio6.addStyleClass("buttonPositionRTL");
                    }
                    if (oRadio7) {
                        oRadio7.removeStyleClass("buttonPosition");
                        oRadio7.addStyleClass("buttonPositionRTL");
                    }
                    if (oRadio8) {
                        oRadio8.removeStyleClass("buttonPosition");
                        oRadio8.addStyleClass("buttonPositionRTL");
                    }
                    if (oRadio9) {
                        oRadio9.removeStyleClass("buttonPosition");
                        oRadio9.addStyleClass("buttonPositionRTL");
                    }
                    if (oRadio10) {
                        oRadio10.removeStyleClass("buttonPosition");
                        oRadio10.addStyleClass("buttonPositionRTL");
                    }
                    if (oBox1) {
                        oBox1.removeStyleClass("boxPosition");
                        oBox1.addStyleClass("boxPositionRTL");
                    }
                    if (oBox2) {
                        oBox2.removeStyleClass("boxPosition");
                        oBox2.addStyleClass("boxPositionRTL");
                    }
                    if (oBox3) {
                        oBox3.removeStyleClass("boxPosition");
                        oBox3.addStyleClass("boxPositionRTL");
                    }
                    if (oBox4) {
                        oBox4.removeStyleClass("boxPosition");
                        oBox4.addStyleClass("boxPositionRTL");
                    }
                    if (oBox5) {
                        oBox5.removeStyleClass("boxPosition");
                        oBox5.addStyleClass("boxPositionRTL");
                    }
                    if (oHBox) {
                        oHBox.removeStyleClass("HBoxStyle");
                        oHBox.addStyleClass("HBoxStyleRTL");
                    }       
                }
            } catch (e) {
                ;
            }
            
        }
    };
});
