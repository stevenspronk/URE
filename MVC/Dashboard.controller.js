sap.ui.controller("MVC.Dashboard", {

	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 * @memberOf MVC.Dashboard
	 */
	onInit: function() {
		var dashboardModel = new sap.ui.model.odata.ODataModel("/destinations/McCoy_URE/DashboardView.xsodata/");
		this.getView().setModel(dashboardModel, "Dashboard");
		var gearIndicator = this.getView().byId("gearIndicator");

		var myData = {
			'GEAR': 5
		};
		var Ojson = new sap.ui.model.json.JSONModel(myData);

		Ojson.setData(myData);
		gearIndicator.setModel(Ojson);

		/*gearIndicator.setModel(dashboardModel);
		gearIndicator.bindElement("/DASHBOARD", {select: "DRIVE_MODE"});
	//	gearIndicator.bindProperty("value", "/DRIVE_MODE"); 
		gearIndicator.bindProperty("value", { path : "/DRIVE_MODE"});
	*/

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

	/*	var oModel = this.getView().getModel("RaceMetaData");
		var raceId = oModel.getObject("/RaceId");

		var aFilter = [];

		aFilter.push(new sap.ui.model.Filter("RACE_ID", sap.ui.model.FilterOperator.Contains, raceId));

		// filter binding
		var oList = this.getView().byId("UreList");
		var oBinding = oList.getBinding("items");
		oBinding.filter(aFilter);

		var aSorter = new sap.ui.model.Sorter("TIMESTAMP", true);
		oBinding.sort(aSorter);

		var ureModel = this.getView().getModel("ComponentTest");

		function refreshData() {
			ureModel.setSizeLimit(1);
			ureModel.refresh();
		}

		setTimeout(function() {
			setInterval(function() {
				refreshData();
			}, 500);
		}, 2000);
	*/
	},

	/**
	 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
	 * @memberOf MVC.Dashboard
	 */
	onExit: function() {

	},

	goToCreateTest: function() {
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		router.navTo("CreateTest", null, false);
	}
});