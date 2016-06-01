var iconTabBar;
var loaded;
 
sap.ui.controller("MVC.Dashboard", {

	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 * @memberOf MVC.Dashboard
	 */
	onInit: function() {
	    loaded = false;
		 
		var url = "/destinations/McCoy_URE/Overview.xsodata/OVERVIEW?$filter=RACE_ID%20eq%20" + raceID + "%20and%20RUN_ID%20eq%20" + runID + "&$orderby=SENSOR_TIMESTAMP%20desc&$top=1&$format=json";
		var dashboardModel = new sap.ui.model.json.JSONModel(url);
	//	var data = dashboardModel.getData();
		//dashboardModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
		
		sap.ui.getCore().setModel(dashboardModel, "Overview");
		this.getView().setModel(dashboardModel, "Overview");

        //this.refreshSteer();
	    var me = this;
	    
      		setTimeout(function() {
			setInterval(function() {
			        if(loaded === true){
					me.refreshSteer();
			        }
			}, 500);
		}, 500);
	},
	
	calculatePower: function(var1,var2) {
        var calc = var1 * var2;
        return calc;  
    },
    
	drawLine: function() {
	
					var ctx = c.getContext("2d");
					ctx.beginPath();
					
					ctx.moveTo(10, 0);
					ctx.rotate(30  * Math.PI / 180);
					ctx.lineTo(10, 150);	
	
	},

	/**
	 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
	 * (NOT before the first rendering! onInit() is used for that one!).
	 * @memberOf MVC.Dashboard
	 */
	//	onBeforeRendering: function() {
	//
	//	},

	/**
	 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 * @memberOf MVC.Dashboard
	 */
	onAfterRendering: function() {
		iconTabBar = this.getView().byId("Dashboard").getParent().getParent().getParent();
        loaded = true;
       /* var dot = '<div style="text-align: left; width: 100%; height: 100%;  background-image: url(/IMG/dot.png); background-position: 50% 50%;  background-repeat: no-repeat;"></div>';   
	    var dotComponent = new sap.ui.core.HTML();
        dotComponent.setContent(dot);
        dotComponent.placeAt("__xmlview2--eight_curve", "only");*/
	},
	
	refreshSteer: function()
	{
	    var data = sap.ui.getCore().getModel("Overview");
	    var value =	data.getProperty("/d/results/0/STEERING");
	   
	    value = Math.floor(value);
	    
	    var html = '<div style="width: 100%; height: 100%; background-size: contain; background-image: url(\'/IMG/steer.png\'); background-repeat: no-repeat; background-position: center; -ms-transform: rotate(' + value + 'deg); /* IE 9 */ -webkit-transform: rotate(' + value + 'deg); /* Chrome, Safari, Opera */ transition: 300ms linear all; transform: rotate(' + value + 'deg);"></div>';
	    var htmlComponent = new sap.ui.core.HTML();
        htmlComponent.setContent(html);
        htmlComponent.placeAt("__xmlview1--OverviewElement--stuuruitslagDiv", "only");
        
	    //var data = sap.ui.getCore().getModel("Overview");
	    //var value =	data.getProperty("/d/results/0/POWER");
	    
	    var value_x =	data.getProperty("/d/results/0/ACCELERATION_X");
	    var value_y =	data.getProperty("/d/results/0/ACCELERATION_Y");
	    /// DEMO 
	   var x = Math.floor(value_x);
	   var y = Math.floor(value_y);
	   var x = 0.0;
	   var y = 0.0;
	   
	   var percent_x = 0;
	   var percent_y = 0;
	   
	   if(x != 0.0)
	   {
	    percent_x = ( ( 3.0 - Math.abs(x) ) * (50 / 30) );
	   }
	   
	   if(y != 0.0)
	   {
	    percent_y = ( ( 2.0 - Math.abs(x) ) * (50 / 20) );
	   }
	   
	   if(x >= 0)
	   {
	   	percent_x = 50 + percent_x;
	   }
	   
	   if(y >= 0)
	   {
	   	percent_y = 50 + percent_y;
	   }
	 
		var dot = '<div style="text-align: left; width: 100%; height: 100%;  background-image: url(/IMG/dot.png); background-position: ' + percent_x + '% ' + percent_y + '%;  background-repeat: no-repeat;"></div>';   
	    var dotComponent = new sap.ui.core.HTML();
        dotComponent.setContent(dot);
        dotComponent.placeAt("__xmlview1--OverviewElement--eight_curve", "only");
        
          
	},
		
	/**
	 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
	 * @memberOf MVC.Dashboard
	 */
	//onExit: function() {

	//},

	goToCreateTest: function() {
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		router.navTo("CreateTest", null, false);
	}
});