sap.ui.controller("MVC.CreateTest", {

	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 * @memberOf MVC.CreateTest
	 */
	onInit: function() {

		var oRaceMetaData = new sap.ui.model.odata.ODataModel("/destinations/McCoy_URE/UreMetadata.xsodata/");
		
		oRaceMetaData.oHeaders = {
				"DataServiceVersion": "3.0",
				"MaxDataServiceVersion": "3.0"
		};
		
		this.getView().setModel(oRaceMetaData,"RaceMetaData");

 		var oBindings = this.getView().getModel("RaceMetaData").bindList("/URE_METADATA");  
 		
//		Generate a RACE ID and bind it to the input
 		var raceId = oBindings.getLength() + 1;
 		this.getView().byId("Race_Id").setValue(raceId);
	
		
	},

	/**
	 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
	 * (NOT before the first rendering! onInit() is used for that one!).
	 * @memberOf MVC.CreateTest
	 */
	//	onBeforeRendering: function() {
	//
	//	},

	/**
	 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 * @memberOf MVC.CreateTest
	 */
		onAfterRendering: function() {

		},

	/**
	 * Called when thse Controller is destroyed. Use this one to free resources and finalize activities.
	 * @memberOf MVC.CreateTest
	 */
	//	onExit: function() {
	//
	//	}

	startTest: function() {
		//First store entry in metadata table
		var requestObj = {
			
			requestUri: '',
			method: '',
			headers: {
				"X-Requested-With": "XMLHttpRequest",
				"Content-Type": "application/json;odata=minimalmetadata",
				"DataServiceVersion": "3.0",
				"MaxDataServiceVersion": "3.0",
				"Accept": "application/json;odata=minimalmetadata"
			}
			
		};
		
		var todayDate = new Date();

		var newData = {
				"RACE_ID": this.getView().byId("Race_Id").getValue(),
				"CIRCUIT":this.getView().byId("Input_Circuit").getValue(),
				"TEMPERATURE": this.getView().byId("Input_Temperature").getSelectedKey(),
				"RACE_DESCRIPTION": this.getView().byId("Input_Race_Description").getValue(),
				// Vanaf hier default waardes.
				"START_TIME": new Date(), 
				"END_TIME": null,   
				"RACE_TYPE": this.getView().byId("Input_RaceType").getSelectedKey(),
				"WEATHER": this.getView().byId("Input_Weather").getSelectedKey(),
				"NOTES": this.getView().byId("Input_Notes").getValue(),
				"CAR_ID": this.getView().byId("Input_CarID").getValue(),
				"CAR_NOTES": this.getView().byId("Input_CarNotes").getValue(),
				"NAME_DRIVER": this.getView().byId("Input_DriverName").getValue(),
				"LENGTH_DRIVER": this.getView().byId("Input_DriverLength").getValue(),
				"WEIGHT_DRIVER": this.getView().byId("Input_DriverWeight").getValue(),
				"DRIVER_NOTES": this.getView().byId("Input_DriverNotes").getValue()
		};
		
		/*		var newData = {
				"RACE_ID": "333",
				"CIRCUIT": null,
				"TEMPERATURE": null,
				"RACE_DESCRIPTION": null,
				// Vanaf hier default waardes.
				"START_TIME": new Date(), 
				"END_TIME": new Date(),   
				"RACE_TYPE": null,
				"WEATHER": null,
				"NOTES": null,
				"CAR_ID": null,
				"CAR_NOTES": null,
				"NAME_DRIVER": null,
				"LENGTH_DRIVER": null,
				"WEIGHT_DRIVER": null,
				"DRIVER_NOTES": null
		};*/
		
		
		
		//var url = "proxy/http/services.odata.org/V3/(S(k42qhed3hw4zgjxfnhivnmes))/OData/OData.svc/Products";
		var url = "/destinations/McCoy_URE/UreMetadata.xsodata/URE_METADATA";
		var method = "POST";
		
		requestObj.requestUri = url;
		requestObj.method = method;
		requestObj.data = newData;
		requestObj.success = this.goToOverview(); // Aanroepen overview scherm
		
		OData.request(requestObj, function() {
			
			//alert(true);
		//		Additionele meuk
		});
		this.goToOverview();

	},

	goToOverview: function() {
		
		var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Overview");
			
		/*var router = sap.ui.core.UIComponent.getRouterFor(this);
		router.navTo("Overview", {
			id: 1
		}, false);*/
	}

});