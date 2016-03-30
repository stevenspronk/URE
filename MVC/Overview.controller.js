var activeView;

sap.ui.controller("MVC.Overview", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf MVC.Overview
*/
	onInit: function() {
		this.router = sap.ui.core.UIComponent.getRouterFor(this);
		this.router.attachRoutePatternMatched(this._handleRouteMatched, this);
	},
	
	onSelect: function(oEvent) {
            var key = oEvent.getParameters().key;
    },
    
	_handleRouteMatched:function(evt){
		if("Overview" !== evt.getParameter("name")){
			return;
		}
		var id = evt.getParameter("arguments").id;
		var model = new sap.ui.model.json.JSONModel({id:id});
		this.getView().setModel(model,"data");
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf MVC.Overview
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf MVC.Overview
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf MVC.Overview
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
		
		// Set variable crudTest to C = Create
		crudTest = 'C';
		router.navTo("CreateTest", {id:1}, false);
	}
});