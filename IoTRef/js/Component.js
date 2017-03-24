jQuery.sap.require( 'iotmms.Router' );
jQuery.sap.require( 'js.util.AjaxHelper' );
jQuery.sap.require( 'js.util.I18nHelper' );
sap.ui.core.UIComponent.extend( 'iotmms.Component', {

	URL_HTTP_PUSH_SERVICE: 'v1/api/http/push',
	URL_DATA_SERVICE: 'v1/internal/http/extensions/dataservices',
	URL_PUSH_SERVICE: 'v1/internal/http/extensions/pushservices',
	URL_EXTENSION_SERVICE: 'v1/internal/http/extensions/processingservices',
	URL_FRAGMENT_SERVICE: 'v1/internal/http/extensions/fragments',
	URL_HTTP_EXTENSION_SERVICE: 'v1/internal/http/extensions/api',
	URL_CONFIG_SERVICE: 'v1/internal/http/config?filter=global eq \'true\'',
	URL_CONFIG_IMPORT: 'v1/internal/http/config/import',
	URL_CONFIG_SERVICE_EXPORT: 'v1/internal/http/config/export?filter=global eq \'true\'',
	URL_CONFIG_SERVICE_SCHEMA: 'v1/internal/http/config/schema?filter=global eq \'true\'',
	URL_CONFIG_SERVICE_RESET: 'v1/internal/http/config/reset',
	URL_HTTP_CONFIG_SERVICE: 'v1/api/http/config/api',
	URL_APP_SERVICE: 'v1/internal/http/app.svc',
	URL_HTTP_APP_SERVICE: 'v1/api/http/app',
	URL_DESTINATION_SERVICE: 'v1/internal/http/destination',
	URL_MONITOR_SERVICE: 'v1/internal/http/monitor',
	URL_MONITOR_HISTORY_SERVICE: 'v1/internal/http/monitorhistory',
	URL_HTTP_RDMS_SERVICE: 'v1/internal/rdms/http/devices/api',
	URL_RDMS_SERVICE: 'v1/internal/rdms/http/devices',
	URL_RDMS_SERVICE_ALL_DEVICES: 'v1/internal/rdms/http/devices?origin=all',
	URL_PROCESSING_SERVICE_MAPPING: 'v1/internal/http/processing',
	URL_HTTP_PROCESSING_SERVICE_MAPPING: 'v1/api/http/processing/api',
	URL_LOGOUT_SERVICE: 'logout',
	URL_USER_INFO: 'userinfo',

	CONFIGURATION_SERVICE_MODEL_NAME: 'configurationServices',
	EXTENSION_SERVICE_MODEL_NAME: 'extensionServices',
	PROCESSING_SERVICE_MAPPINGS_MODEL_NAME: 'processingServiceMappings',
	PROCESSING_SERVICE_MAPPING_MODEL_NAME: 'processingServiceMapping',
	USER_INFO_MODEL_NAME: 'user',

	metadata: {
		routing: {
			config: {
				routerClass: iotmms.Router,
				viewType: 'JS',
				viewPath: 'js.ui',
				targetControl: 'iotmmsapp'
			},
			routes: [ {
				pattern: '',
				name: 'main',
				view: 'main',
				targetAggregation: 'pages',
				viewLevel: 1
			}, {
				pattern: 'appdata',
				name: 'appdata',
				view: 'appdata',
				targetAggregation: 'pages'
			}, {
				pattern: 'appdata/{schema}/{table}',
				name: 'appdatatable',
				view: 'appdata',
				targetAggregation: 'pages'
			}, {
				pattern: 'appdatachart',
				name: 'appdatachart',
				view: 'appdata',
				targetAggregation: 'pages'
			}, {
				pattern: 'appdatachart/devices/{deviceid}',
				name: 'appdatachartdevices',
				view: 'appdata',
				targetAggregation: 'pages'
			}, {
				pattern: 'dataservice/{url}',
				name: 'dataservice',
				viewPath: 'js.ui.dataservice',
				view: 'dataservice',
				targetAggregation: 'pages'
			}, {
				pattern: 'config',
				name: 'config',
				view: 'config',
				targetAggregation: 'pages'
			}, {
				pattern: 'pushservice',
				name: 'pushservice',
				view: 'pushservice',
				targetAggregation: 'pages'
			}, {
				pattern: 'devices',
				name: 'devices',
				view: 'devices',
				targetAggregation: 'pages'
			}, {
				pattern: 'monitor',
				name: 'monitor',
				view: 'monitor',
				targetAggregation: 'pages'
			}, {
				pattern: 'internalapi',
				name: 'internalapi',
				viewPath: 'js.ui.internalapi',
				view: 'internalapi',
				targetAggregation: 'pages'
			}, {
				pattern: 'processingservicemappings',
				name: 'processingServiceMappings',
				viewPath: 'js.ui.processingservicemappings',
				view: 'mappings',
				targetAggregation: 'pages',
				viewLevel: 2
			}, {
				pattern: 'processingservicemapping',
				name: 'createProcessingServiceMapping',
				viewPath: 'js.ui.processingservicemapping',
				view: 'mapping',
				targetAggregation: 'pages',
				viewLevel: 3
			}, {
				pattern: 'processingservicemapping/{deviceTypeId}/{messageTypeId}',
				name: 'editProcessingServiceMapping',
				viewPath: 'js.ui.processingservicemapping',
				view: 'mapping',
				targetAggregation: 'pages',
				viewLevel: 3
			}, {
				pattern: 'processingservicemapping/{processingService}',
				name: 'createProcessingServiceNoMapping',
				viewPath: 'js.ui.processingservice',
				view: 'processingservice',
				targetAggregation: 'pages',
				viewLevel: 4
			}, {
				pattern: 'processingservicemapping/{deviceTypeId}/{messageTypeId}/{processingService}',
				name: 'createProcessingServiceWithMapping',
				viewPath: 'js.ui.processingservice',
				view: 'processingservice',
				targetAggregation: 'pages',
				viewLevel: 4
			} ]
		}
	},

	init: function() {
		sap.ui.core.UIComponent.prototype.init.apply( this, arguments );
		I18nHelper.init( this );
		this.initIconModel();
		this.initVersionResourceModel();
		this.loadDataServiceModel();
		this.initDestinationModel();
		this.initProcessingServiceMappingModel();
		this.getRouter().initialize();
		this.initUserModel();
		this.initSettingsModel();
	},

	initSettingsModel: function() {
		var settingsModel = new sap.ui.model.json.JSONModel( 'model/settings.json' );
		settingsModel.attachRequestCompleted( function( evt ) {
			var language = sap.ui.getCore().getConfiguration().getLocale().getLanguage();
			settingsModel.setProperty( '/selectedLanguage', language );
		} );
		this.setModel( settingsModel, 'settings' );
	},

	loadDataServiceModel: function() {
		var sUrl = this.URL_DATA_SERVICE;
		var oParameters = null;
		var bAsync = false;
		var sType = 'GET';
		var bMerge = false;
		var bCache = false;
		var oHeaders = {
			'Accept-Language': sap.ui.getCore().getConfiguration().getLanguage()
		};

		var oJSONModel = this.getModel( 'dataservice' );
		if ( !oJSONModel ) {
			oJSONModel = new sap.ui.model.json.JSONModel();
			this.setModel( oJSONModel, 'dataservice' );
		}
		oJSONModel.loadData( sUrl, oParameters, bAsync, sType, bMerge, bCache, oHeaders );
	},

	initVersionResourceModel: function() {
		var versionModel = new sap.ui.model.json.JSONModel( "model/version.json" );
		this.setModel( versionModel, 'version' );
	},

	initIconModel: function() {
		var oJSONModel = new sap.ui.model.json.JSONModel( 'model/icon.json' );
		this.setModel( oJSONModel, 'icon' );
	},

	initUserModel: function() {
		var userModel = new sap.ui.model.json.JSONModel( this.URL_USER_INFO );
		userModel.attachRequestCompleted( function() {
			// remote user is URL-encoded to avoid Fortify issue and must be decoded before use
			var remoteUser = userModel.getProperty( '/remoteuser' );
			if ( !!remoteUser ) {
				userModel.setProperty( '/remoteuser', decodeURIComponent( remoteUser ) );
			}
		}, this );
		this.setModel( userModel, this.USER_INFO_MODEL_NAME );
	},

	initDestinationModel: function() {
		var oJSONModel = new sap.ui.model.json.JSONModel( this.URL_DESTINATION_SERVICE );
		this.setModel( oJSONModel, 'destination' );
	},

	initProcessingServiceMappingModel: function() {
		var oJSONModel = new sap.ui.model.json.JSONModel( {} );
		this.setModel( oJSONModel, this.PROCESSING_SERVICE_MAPPING_MODEL_NAME );
	},

	createContent: function() {
		return sap.ui.view( {
			viewName: 'js.ui.app',
			type: 'JS',
			viewData: {
				component: this
			}
		} );
	}

} );
