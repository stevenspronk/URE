sap.ui.jsview( 'js.ui.appdata', {

	getControllerName: function() {
		return 'js.ui.appdata';
	},

	createPullToRefresh: function() {
		var oController = this.getController();
		this.oPullToRefresh = new sap.m.PullToRefresh( {
			refresh: function( oEvent ) {
				oController.onPullRefresh( oEvent );
			}
		} );
		return this.oPullToRefresh;
	},

	createHeader: function() {
		var oController = this.getController();
		oController.getTitle = function() {
			return I18nHelper.getI18nText( 'LABEL_DATA' );
		};
		return sap.ui.jsfragment( 'js.ui.fragment.header', oController );
	},

	createStandardListItem: function() {
		var oController = this.getController();
		var oStandardListItem = new sap.m.StandardListItem( {
			type: sap.m.ListType.Navigation,
			title: '{meta>name}',
			description: '{meta>schema}',
			icon: '{icon>/TABLE}',
			counter: {
				path: 'meta>count',
				formatter: function( sCount ) {
					return parseInt( sCount );
				}
			},
			press: function( oEvent ) {
				oController.onStandardListItemPress( oEvent );
			}
		} );
		return oStandardListItem;
	},

	createToolbar: function() {
		var oController = this.getController();
		var oTitle = new sap.m.Title( {
			text: {
				path: 'meta>/',
				formatter: function( oMeta ) {
					if ( oMeta.hasOwnProperty( 'd' ) ) {
						return I18nHelper.getI18nText( 'LABEL_TABLES', [ oMeta.d.results.length ] )
					}
					return '';
				}
			}
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
			content: [ oTitle, new sap.m.ToolbarSpacer(), oAboutButton ]
		} );
	},

	createIconTabBar: function() {
		var oController = this.getController();
		var oIconTabBar = new sap.m.IconTabBar( this.createId( "iconTabBar" ), {
			expanded: true,
			expandable: false,
			stretchContentHeight: true,
			applyContentPadding: false,
			select: [ oController.onTabBarPressed, oController ]
		} );

		var oTableView = sap.ui.jsview( this.createId( "tableView" ), 'js.ui.apptable' );
		oTableView.setHeight( '100%' ); // required to enable scrolling in child pages

		var oTableList = this.createListView();

		var oTableTab = new sap.m.IconTabFilter( {
			content: [ oTableList, oTableView ],
			icon: '{icon>/TABLE}',
			key: 'table'
		} );

		var oChartView = sap.ui.xmlview( 'js.ui.appchart' );

		var oChartTab = new sap.m.IconTabFilter( {
			content: oChartView,
			icon: '{icon>/CHART}',
			key: 'chart'
		} );

		oIconTabBar.addItem( oTableTab );
		oIconTabBar.addItem( oChartTab );

		return oIconTabBar;
	},

	createListView: function() {
		// table must be placed into own page to enable scrolling
		var tablePage = new sap.m.Page( {
			enableScrolling: true,
			showHeader: false,
			showSubHeader: false,
			showFooter: false,
			content: this.createList()
		} );

		var page = new sap.m.Page( this.createId( "tableList" ), {
			enableScrolling: false,
			showHeader: false,
			showSubHeader: false,
			showFooter: false,
			content: [ this.createPullToRefresh(), tablePage ]
		} );
		return page;
	},

	createList: function() {
		var oList = new sap.m.List( {
			inset: true,
			headerToolbar: this.createToolbar()
		} );
		var bDescending = false;
		var oSorter = new sap.ui.model.Sorter( 'name', bDescending );
		oList.bindAggregation( 'items', {
			path: 'meta>/d/results',
			template: this.createStandardListItem(),
			sorter: oSorter
		} );
		return oList;
	},

	createContent: function( oController ) {
		this.setDisplayBlock( true );
		return new sap.m.Page( {
			enableScrolling: false, // must be disabled because scrolling of tables is handled within apptable
			// view
			customHeader: this.createHeader(),
			content: this.createIconTabBar()
		} );
	}

} );