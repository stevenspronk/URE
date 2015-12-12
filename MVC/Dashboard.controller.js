sap.ui.controller("MVC.Dashboard", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf MVC.Dashboard
*/
	onInit: function() {
		this.router = sap.ui.core.UIComponent.getRouterFor(this);
		this.router.attachRoutePatternMatched(this._handleRouteMatched, this);
		
		
		
	},
	
	onSelect: function(oEvent) {
            var key = oEvent.getParameters().key;
    },
	_handleRouteMatched:function(evt){
		if("Dashboard" !== evt.getParameter("name")){
			return;
		}
		var id = evt.getParameter("arguments").id;
		var model = new sap.ui.model.json.JSONModel({id:id});
		this.getView().setModel(model,"data");
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
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf MVC.Dashboard
*/
//	onExit: function() {
//
//	}
	onNavBack:function(){
		
		window.history.go(-1);
	},
	
	navButtonTap:function(){
              window.history.go(-1);
              },
	
	newTest  :function(){
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		router.navTo("CreateTest", {id:1}, false);
	}
	
});