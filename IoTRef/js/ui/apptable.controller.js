js.core.Controller.extend( 'js.ui.apptable', {

	oDialog: null,

	bAfterRenderWasInvoked: false,

	onInit: function() {
		this.getRouter().getRoute( 'appdatatable' ).attachPatternMatched( this.onRouteMatched, this );
		var oData = {
			schema: null,
			table: null,
			actual: null,
			total: null
		};
		var oJSONModel = new sap.ui.model.json.JSONModel();
		oJSONModel.setJSON( JSON.stringify( oData ) );
		this.getView().setModel( oJSONModel, 'conf' );
	},

	/**
	 * Firefox does not support model initialization from a XHR-Requests during the view is rendered. There
	 * for the model is initialized after the view is rendered. When the view was rendered initially the data
	 * can be loaded in the onRouteMatched callback.
	 */
	onAfterRendering: function() {
		if ( sap.ui.Device.browser.mozilla ) {
			this.updateTableData();
			this.bAfterRenderWasInvoked = true;
		}
	},

	onRouteMatched: function( oEvent ) {
		var oParameters = oEvent.getParameters();
		var sSchema = oParameters.arguments.schema;
		var sTable = oParameters.arguments.table;

		var oModel = this.getView().getModel( 'conf' );
		oModel.getData().schema = sSchema;
		oModel.getData().table = sTable;
		oModel.updateBindings( false );

		/*
		 * Just load data for mozilla if the rendered callback was already invoked. Other browser should load
		 * data immediately.
		 */
		if ( sap.ui.Device.browser.mozilla ) {
			if ( this.bAfterRenderWasInvoked ) {
				this.getTableData( sSchema, sTable );
			}
		} else {
			this.getTableData( sSchema, sTable );
		}
	},

	onUpdateStarted: function( oEvent ) {
		var oPullToRefresh = this.getView().oPullToRefresh;
		if ( !oPullToRefresh.isBusy() ) {
			oPullToRefresh.setBusy( true );
		}
	},

	onUpdateFinished: function( oEvent ) {
		var sDescription = I18nHelper.getI18nText( 'TEXT_LAST_UPDATE', [ new Date().toLocaleString() ] );
		var oPullToRefresh = this.getView().oPullToRefresh;
		oPullToRefresh.setDescription( sDescription );
		oPullToRefresh.setBusy( false );

		var oTable = oEvent.getSource();
		var actual = oEvent.getParameters().actual;
		var total = oEvent.getParameters().total;

		var oModel = oTable.getModel( 'conf' );
		oModel.getData().actual = actual;
		oModel.getData().total = total;
		oModel.updateBindings( false );
	},

	getTableData: function( schema, name ) {
		var oTable = this.getView().oTable;
		oTable.removeAllColumns();

		var oModel = oTable.getModel( 'table' );
		oModel.refreshMetadata();

		var oSorter = null;
		var oServiceMetadata = oModel.getServiceMetadata();
		var oColumnListItem = new sap.m.ColumnListItem();
		var oSchema = oServiceMetadata.dataServices.schema[0];
		var sNamespace = oSchema.namespace;
		var oEntityContainer = oSchema.entityContainer;
		var entitySetName = name;
		var entityContainerName = schema;
		for ( var m = 0; m < oEntityContainer.length; m++ ) {

			var schemaName = oEntityContainer[m].name;
			var extensions = oEntityContainer[m].extensions;
			if ( extensions !== undefined ) {
				for ( var t = 0; t < extensions.length; t++ ) {
					if ( extensions[t].name == 'SchemaName' ) {
						schemaName = extensions[t].value;
					}
				}
			}

			if ( schema === schemaName ) {
				entityContainerName = oEntityContainer[m].name;
				var oNonUniqueEntitySet = oEntityContainer[m].entitySet;
				var oVisited = {};
				var oEntitySet = oNonUniqueEntitySet.filter( function( oNext ) {
					var sNextEntityType = oNext.entityType;
					return oVisited.hasOwnProperty( sNextEntityType ) ? false
						: (oVisited[sNextEntityType] = true);
				} );
				for ( var i = 0; i < oEntitySet.length; i++ ) {
					var tableName = oEntitySet[i].name;
					var extensions = oEntitySet[i].extensions;
					if ( extensions !== undefined ) {
						for ( var t = 0; t < extensions.length; t++ ) {
							if ( extensions[t].name == 'TableName' ) {
								tableName = extensions[t].value;
							}
						}
					}
					if ( name === tableName ) {
						entitySetName = oEntitySet[i].name;
						var sEntitySetType = oEntitySet[i].entityType.replace( sNamespace, '' ).replace( '.', '' );
						var oEntityType = oServiceMetadata.dataServices.schema[0].entityType;
						for ( var j = 0; j < oEntityType.length; j++ ) {
							var sEntityTypeName = oEntityType[j].name;
							if ( sEntityTypeName === sEntitySetType ) {
								var oProperty = oEntityType[j].property;
								if ( oProperty !== undefined ) {
									for ( var k = 0; k < oProperty.length; k++ ) {
										var sPropertyName = oProperty[k].name;
										if ( 'G_CREATED' === sPropertyName ) {
											var bDescending = true;
											oSorter = new sap.ui.model.Sorter( 'G_CREATED', bDescending );
										}

										var columnName = sPropertyName;
										var extensions = oProperty[k].extensions;
										if ( extensions !== undefined ) {
											for ( var t = 0; t < extensions.length; t++ ) {
												if ( extensions[t].name == 'ColumnName' ) {
													columnName = extensions[t].value;
												}
											}
										}

										var oColumn = new sap.m.Column( {
											header: new sap.m.Text( {
												text: columnName
											} )
										} );
										oTable.addColumn( oColumn );
										oColumnListItem.addCell( new sap.m.Text( {
											text: '{table>'.concat( sPropertyName ).concat( '}' )
										} ) );
									}
								}
							}
						}
					}
				}
			}
		}
		oTable.bindItems( 'table>/'.concat( entityContainerName, '.', entitySetName ), oColumnListItem, oSorter );
	},

	updateTableData: function() {
		var oModel = this.getView().getModel( 'conf' );
		var sSchema = oModel.getData().schema;
		var sTable = oModel.getData().table;

		this.getTableData( sSchema, sTable );
	},

	onPullRefresh: function( oEvent ) {
		oEvent.getSource().hide();
		this.updateTableData();
	},

	onAboutButtonPress: function( oEvent ) {
		if ( !this.oDialog ) {
			this.oDialog = sap.ui.jsview( 'js.ui.odatadialog' );
			this.getView().addDependent( this.oDialog );
		}
		var sPath = this.getView().oTable.getBindingPath( 'items' );
		this.oDialog.open( sPath );
	},

	onBackToTableListPress: function( oEvent ) {
		var bNoHistoryEntry = true;
		this.getRouter().navTo( 'appdata', null, bNoHistoryEntry );
	}

} );