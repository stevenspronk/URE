sap.ui.jsfragment('js.ui.fragment.back', {

	createContent : function(oController) {
		return new sap.m.Button({
			icon : '{icon>/BACK}',
			tooltip : '{i18n>TOOLTIP_BACK}',
			press : function(oEvent) {
				oController.back();
			}
		});
	}

});