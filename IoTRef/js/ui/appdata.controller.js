js.core.Controller.extend( 'js.ui.appdata', {

	oDialog: null,

	bAfterRenderWasInvoked: false,

	/**
	 * This array is used to check if the page has to be reloaded because of an UI5 OData metadata bug. See:
	 * https://github.com/SAP/openui5/issues/1091 If the metadata model changes the page has to be reloaded.
	 */
	mTableMap: [],

	onInit: function() {
		var router = this.getRouter();
		router.getRoute( 'appdata' ).attachPatternMatched( this.onRouteMatched, this );
		router.getRoute( 'appdatatable' ).attachPatternMatched( this.onRouteMatched, this );
		router.getRoute( 'appdatachart' ).attachPatternMatched( this.onRouteMatched, this );
		router.getRoute( 'appdatachartdevices' ).attachPatternMatched( this.onRouteMatched, this );

		this.getView().setModel( new sap.ui.model.json.JSONModel(), 'meta' );
	},

	onRouteMatched: function( oEvent ) {
		var oIconTabBar = this.getView().byId( 'iconTabBar' );
		var oTableView = this.getView().byId( 'tableView' );
		var oTableList = this.getView().byId( 'tableList' );
		var oParameters = oEvent.getParameters();
		var sParameterName = oParameters.name;

		switch ( sParameterName ) {
			case 'appdata':
				oTableView.setVisible( false );
				oTableList.setVisible( true );
				oIconTabBar.setSelectedKey( 'table' );
			break;
			case 'appdatatable':
				oTableView.setVisible( true );
				oTableList.setVisible( false );
				oIconTabBar.setSelectedKey( 'table' );
			break;
			case 'appdatachart':
			case 'appdatachartdevices':
				oIconTabBar.setSelectedKey( 'chart' );
			break;
		}

		/*
		 * Just load data for mozilla if the rendered callback was already invoked. Other browser should load
		 * data immediately.
		 */
		if ( sap.ui.Device.browser.mozilla ) {
			if ( this.bAfterRenderWasInvoked ) {
				this.getTablesMeta();
			}
		} else {
			this.getTablesMeta();
		}
	},

	back: function() {
		var bNoHistoryEntry = true;
		this.getRouter().navTo( 'main', null, bNoHistoryEntry );
	},

	/**
	 * Firefox does not support model initialization from a XHR-Requests during the view is rendered. There
	 * for the model is initialized after the view is rendered. When the view was rendered initially the data
	 * can be loaded in the onRouteMatched callback.
	 */
	onAfterRendering: function() {
		if ( sap.ui.Device.browser.mozilla ) {
			this.getTablesMeta();
			this.bAfterRenderWasInvoked = true;
		}
	},

	getTablesMeta: function() {
		var that = this;

		var sUrl = this.getOwnerComponent().URL_APP_SERVICE.concat( '/count?$format=json' );

		var errorHandler = function( jqXHR, textStatus, errorThrown ) {
			jQuery.sap.log.error( 'getTablesMeta()', jqXHR.status + ' ' + jqXHR.statusText, 'appdata.controller.js' );
			sap.m.MessageToast.show( jqXHR.status + ' ' + jqXHR.statusText );
		};

		var successHandler = function( oData, textStatus, jqXHR ) {
			if ( oData == null || oData == undefined || oData.d == null || oData.d == undefined
				|| oData.d.results == null || oData.d.results == undefined || oData.d.results.length == 0 ) {
				sap.m.MessageToast.show( I18nHelper.getI18nText( 'TEXT_NO_TABLES' ) );
				return;
			}

			// Check expected result set
			if ( oData.d && oData.d.results ) {
				// Get all table names
				var mCurrentTableMap = oData.d.results.map( function( oTable ) {
					return oTable.name;
				} );

				// When table names change and the page was not initialized in this step than page must reload
				if ( that.mTableMap.length > 0 && !jQuery.sap.equal( that.mTableMap, mCurrentTableMap, 1 ) ) {
					window.location.reload();
				} else {
					that.mTableMap = mCurrentTableMap;
				}
			}

			that.getView().getModel( 'meta' ).setData( oData );

			var sDescription = I18nHelper.getI18nText( 'TEXT_LAST_UPDATE', [ new Date().toLocaleString() ] );
			that.getView().oPullToRefresh.setDescription( sDescription );
		};

		var afterHandler = function( jqXHR, textStatus ) {
			setTimeout( function() {
				that.getView().oPullToRefresh.setBusy( false );
				that.getView().oPullToRefresh.hide();
			}, 500 );
		};

		var beforeHandler = function() {
			var oPullToRefresh = that.getView().oPullToRefresh;
			if ( !oPullToRefresh.getBusy() ) {
				oPullToRefresh.setBusy( true );
			}
		};

		AjaxHelper.doAjaxGet( sUrl, successHandler, errorHandler, beforeHandler, afterHandler );
	},

	onStandardListItemPress: function( oEvent ) {
		var oSource = oEvent.getSource();
		var oBindingContext = oSource.getBindingContext( 'meta' );
		var sSchema = oBindingContext.getProperty( 'schema' );
		var sTable = oBindingContext.getProperty( 'name' );
		var bNoHistoryEntry = false;
		this.getRouter().navTo( 'appdatatable', {
			schema: sSchema,
			table: sTable
		}, bNoHistoryEntry );
	},

	onPullRefresh: function( oEvent ) {
		this.getTablesMeta();
	},

	onAboutButtonPress: function( oEvent ) {
		if ( !this.oDialog ) {
			this.oDialog = sap.ui.jsview( 'js.ui.odatadialog' );
			this.getView().addDependent( this.oDialog );
		}
		this.oDialog.open();
	},

	onTabBarPressed: function( oEvent ) {
		var sKey = oEvent.getParameters().key;

		// default is table tab
		var sRoute = 'appdata';

		if ( sKey === 'chart' ) {
			sRoute = 'appdatachart';
		}

		var bNoHistoryEntry = false;
		this.getRouter().navTo( sRoute, null, bNoHistoryEntry );
	}

} );