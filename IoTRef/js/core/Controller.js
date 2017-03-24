jQuery.sap.require( 'sap.m.MessageToast' );
sap.ui.core.mvc.Controller.extend( 'js.core.Controller', {

	onInit: function() {
		var oEventBus = this.getEventBus();

		oEventBus.subscribe( Channel.APP, Event.BEFORE_AJAX, AjaxHelper.onBeforeAjax, this );
		oEventBus.subscribe( Channel.APP, Event.AFTER_AJAX, AjaxHelper.onAfterAjax, this );

		$( document ).ready( function() {
			document.title = I18nHelper.getI18nText( 'LABEL_TITLE' );
		} );

	},

	getEventBus: function() {
		return this.getOwnerComponent().getEventBus();
	},

	getRouter: function() {
		return sap.ui.core.UIComponent.getRouterFor( this );
	},

	getRoute: function( sName ) {
		return this.getRouter().getRoute( sName );
	},

	back: function() {
		this.getRouter().back();
	},

	initConfigServiceModel: function( errHandler, sucHandler, befHandler, aftHandler ) {
		var that = this;
		var errorHandler = function( jqXHR, textStatus, errorThrown ) {
			jQuery.sap.log.error( 'getData()', jqXHR.status + ' ' + jqXHR.statusText, 'controller.js' );
			sap.m.MessageToast.show( I18nHelper.getI18nText( 'TEXT_CONFIG_GET_ERROR' ) );
			if ( (typeof errHandler) === 'function' ) {
				errHandler.apply( that, [ jqXHR, textStatus, errorThrown ] );
			}
		};

		var successHandler = function( oData, textStatus, jqXHR ) {
			var oJSONModel = that.getView().getModel( that.getOwnerComponent().CONFIGURATION_SERVICE_MODEL_NAME );
			if ( !oJSONModel ) {
				oJSONModel = new sap.ui.model.json.JSONModel();
				oJSONModel.setData( oData );
				that.getView().setModel( oJSONModel, that.getOwnerComponent().CONFIGURATION_SERVICE_MODEL_NAME );
			} else {
				oJSONModel.setData( oData );
			}

			if ( (typeof sucHandler) === 'function' ) {
				sucHandler.apply( that, [ oData, textStatus, jqXHR ] );
			}
		};

		AjaxHelper.doAjaxGet( this.getOwnerComponent().URL_CONFIG_SERVICE, successHandler, errorHandler, befHandler, aftHandler );
	},

	initProcessingServiceMappingsModel: function( errHandler, sucHandler, befHandler, aftHandler ) {
		var that = this;
		var errorHandler = function( jqXHR, textStatus, errorThrown ) {
			jQuery.sap.log.error( 'getData()', jqXHR.status + ' ' + jqXHR.statusText, 'controller.js' );
			sap.m.MessageToast.show( I18nHelper.getI18nText( 'TEXT_PROCESSING_SERVICE_GET_ERROR' ) );
			if ( (typeof errHandler) === 'function' ) {
				errHandler.apply( that, [ jqXHR, textStatus, errorThrown ] );
			}
		};

		var successHandler = function( oData, textStatus, jqXHR ) {
			var oJSONModel = that.getView().getModel( that.getOwnerComponent().PROCESSING_SERVICE_MAPPINGS_MODEL_NAME );
			if ( !oJSONModel ) {
				oJSONModel = new sap.ui.model.json.JSONModel();
				oJSONModel.setData( oData );
				that.getView().setModel( oJSONModel, that.getOwnerComponent().PROCESSING_SERVICE_MAPPINGS_MODEL_NAME );
			} else {
				oJSONModel.setData( oData );
			}

			if ( (typeof sucHandler) === 'function' ) {
				sucHandler.apply( that, [ oData, textStatus, jqXHR ] );
			}
		};

		AjaxHelper.doAjaxGet( this.getOwnerComponent().URL_PROCESSING_SERVICE_MAPPING, successHandler, errorHandler, befHandler, aftHandler );
	},

	initExtensionServiceModel: function( errHandler, sucHandler, befHandler, aftHandler ) {
		var that = this;
		var errorHandler = function( jqXHR, textStatus, errorThrown ) {
			jQuery.sap.log.error( 'getData()', jqXHR.status + ' ' + jqXHR.statusText, 'controller.js' );
			sap.m.MessageToast.show( I18nHelper.getI18nText( 'TEXT_EXTENSION_SERVICE_GET_ERROR' ) );
			if ( (typeof errHandler) === 'function' ) {
				errHandler.apply( that, [ jqXHR, textStatus, errorThrown ] );
			}
		};

		var successHandler = function( oData, textStatus, jqXHR ) {
			var oJSONModel = that.getView().getModel( that.getOwnerComponent().EXTENSION_SERVICE_MODEL_NAME );
			if ( !oJSONModel ) {
				oJSONModel = new sap.ui.model.json.JSONModel();
				oJSONModel.setData( oData );
				that.getView().setModel( oJSONModel, that.getOwnerComponent().EXTENSION_SERVICE_MODEL_NAME );
			} else {
				oJSONModel.setData( oData );
			}

			if ( (typeof sucHandler) === 'function' ) {
				sucHandler.apply( that, [ oData, textStatus, jqXHR ] );
			}
		};

		AjaxHelper.doAjaxGet( this.getOwnerComponent().URL_EXTENSION_SERVICE, successHandler, errorHandler, befHandler, aftHandler );
	}

} );