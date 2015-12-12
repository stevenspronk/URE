sap.ui.jsview("MVC.App", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf MVC.App
	*/ 
	getControllerName : function() {
		return "MVC.App";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf MVC.App
	*/ 
	createContent : function(oController) {
		this.setDisplayBlock(true);
 		return new sap.m.App("navContainer");
	}

});