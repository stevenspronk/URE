sap.ui.jsview( 'js.ui.apptable', {

	getControllerName: function() {
		return 'js.ui.apptable';
	},

	createPullToRefresh: function() {
		var oController = this.getController();
		this.oPullToRefresh = new sap.m.PullToRefresh( {
			refresh: function( oEvent ) {
				oController.onPullRefresh( oEvent );
			},
			layoutData: new sap.m.FlexItemData( {
				growFactor: 1
			} )
		} );
		return this.oPullToRefresh;
	},

	createToolbar: function() {
		var oController = this.getController();
		// the title is divided into two lines in order to avoid the truncated title
		var oFirstTitleLine = new sap.m.Title( {
			text: {
				parts: [ {
					path: 'conf>/schema'
				}, {
					path: 'conf>/table'
				} ],
				formatter: function( schema, name ) {
					if ( schema === null || name === null ) {
						return '';
					}
					return I18nHelper.getI18nText( 'TEXT_TABLE_HEADER', schema.concat( '.', name ) );
				}
			},
			tooltip: {
				parts: [ {
					path: 'conf>/schema'
				}, {
					path: 'conf>/table'
				} ],
				formatter: function( schema, name ) {
					if ( schema === null || name === null ) {
						return '';
					}
					return I18nHelper.getI18nText( 'TEXT_TABLE_HEADER', schema.concat( '.', name ) );
				}
			}
		} );

		var oSecondTitleLine = new sap.m.Label( {
			text: {
				parts: [ {
					path: 'conf>/total'
				}, {
					path: 'conf>/actual'
				} ],
				formatter: function( total, actual ) {
					if ( total === null || actual === null ) {
						return '';
					}
					return I18nHelper.getI18nText( 'TEXT_TABLE_FOOTER', [ actual, total ] );
				}
			},
			tooltip: {
				parts: [ {
					path: 'conf>/total'
				}, {
					path: 'conf>/actual'
				} ],
				formatter: function( total, actual ) {
					if ( total === null || actual === null ) {
						return '';
					}
					return I18nHelper.getI18nText( 'TEXT_TABLE_FOOTER', [ actual, total ] );
				}
			}
		} );

		var oVbox = new sap.m.VBox( {
			items: [ oFirstTitleLine, oSecondTitleLine ]
		} );

		var oAboutButton = new sap.m.Button( {
			text: '{i18n>LABEL_ODATA_API}',
			tooltip: '{i18n>TOOLTIP_ABOUT_ODATA_API}',
			icon: '{icon>/ODATA}',
			press: function( oEvent ) {
				oController.onAboutButtonPress( oEvent );
			}
		} );

		return new sap.m.Toolbar( {
			content: [ oVbox, new sap.m.ToolbarSpacer(), oAboutButton ]
		} );

	},

	createBackButton: function() {
		var oController = this.getController();
		return new sap.m.Button( {
			icon: '{icon>/BACK}',
			tooltip: '{i18n>TOOLTIP_BACK}',
			press: function( oEvent ) {
				oController.onBackToTableListPress( oEvent );
			},
			layoutData: new sap.m.FlexItemData( {
				growFactor: 0
			} )
		} );
	},

	createTable: function() {
		var oController = this.getController();
		this.oTable = new sap.m.Table( {
			inset: true,
			headerToolbar: this.createToolbar(),
			enableBusyIndicator: false,
			growing: true,
			growingScrollToLoad: true,
			growingThreshold: 50,
			updateStarted: function( oEvent ) {
				oController.onUpdateStarted( oEvent );
			},
			updateFinished: function( oEvent ) {
				oController.onUpdateFinished( oEvent );
			}
		} );
		var sUrl = oController.getOwnerComponent().URL_APP_SERVICE;
		var bFormatJson = true;
		var oODataModel = new sap.ui.model.odata.ODataModel( sUrl, bFormatJson );
		this.oTable.setModel( oODataModel, 'table' );

		return this.oTable;
	},

	createHeader: function() {
		var oController = this.getController();
		oController.getTitle = function() {
			return I18nHelper.getI18nText( 'LABEL_DATA' );
		};
		return sap.ui.jsfragment( 'js.ui.fragment.header', oController );
	},

	createContent: function( oController ) {
		var tableHeader = new sap.m.HBox( {
			items: [ this.createBackButton(), this.createPullToRefresh() ]
		} );

		// table must be placed into own page to enable scrolling
		var tablePage = new sap.m.Page( {
			enableScrolling: true,
			showHeader: false,
			showSubHeader: false,
			showFooter: false,
			content: this.createTable()
		} );

		var page = new sap.m.Page( {
			enableScrolling: false,
			showHeader: false,
			showSubHeader: false,
			showFooter: false,
			content: [ tableHeader, tablePage ]
		} );
		return page;
	}

} );