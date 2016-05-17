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
		//raceID = 180;

		var url = "/destinations/McCoy_URE/Overview.xsodata/OVERVIEW?$filter=RACE_ID%20eq%20" + raceID + "%20and%20RUN_ID%20eq%20" + runID + "&$orderby=SENSOR_TIMESTAMP%20desc&$top=1&$format=json";
		var dashboardModel = new sap.ui.model.json.JSONModel(url);
		var data = dashboardModel.getData();
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

	   this.refreshSteer();
	     
	    var me = this;

		setTimeout(function() {
			setInterval(function() {
					me.refreshSteer();
			}, 1000);
		}, 1000);
		

		iconTabBar = this.getView().byId("Dashboard").getParent().getParent().getParent();
        loaded = true;
	},
	
	refreshSteer: function()
	{
	    var data = sap.ui.getCore().getModel("Overview");
	    var value =	data.getProperty("/d/results/0/POWER");
	   
	    var test = Math.round(Math.random());
	    value = Math.floor(Math.random()*90);
	    
	    if(test === 0) {
	        value = 0 - value;
	    }
	    
	    var html = '<div style="width: 100%; height: 100%; background-size: contain; background-image: url(\'/IMG/steer.png\'); background-repeat: no-repeat; background-position: center; -ms-transform: rotate(' + value + 'deg); /* IE 9 */ -webkit-transform: rotate(' + value + 'deg); /* Chrome, Safari, Opera */ transition: 300ms linear all; transform: rotate(' + value + 'deg);"></div>';
	    var htmlComponent = new sap.ui.core.HTML();
        htmlComponent.setContent(html);
        htmlComponent.placeAt("__xmlview2--stuuruitslagDiv", "only");
        
	    //var data = sap.ui.getCore().getModel("Overview");
	    //var value =	data.getProperty("/d/results/0/POWER");
	    
	    /// DEMO
	   var x = Math.floor(Math.random()*150);
	   var y = Math.floor(Math.random()*150);
	   
	    var dot = '<div width="100%" height="100%" style="text-align: left"><img src="/IMG/dot.png" style="margin-left: ' + y + 'px; margin-top: ' + x + 'px" ></div>';
        
	    var dotComponent = new sap.ui.core.HTML();
        dotComponent.setContent(dot);
        dotComponent.placeAt("__xmlview2--eight_curve", "only");
        
        
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