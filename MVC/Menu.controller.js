sap.ui.controller("MVC.Menu", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf MVC.Menu
*/
//	onInit: function() {
//
//	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf MVC.Menu
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf MVC.Menu
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf MVC.Menu
*/
//	onExit: function() {
//
//	}
	goToCreateTest:function(){
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		router.navTo("CreateTest", null, false);
	},
	goToDashboard:function(){
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		router.navTo("Dashboard", {id:1}, false);
	},
	goThirdView:function(){
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		router.navTo("Dashboard", {id:7}, false);
	}
});