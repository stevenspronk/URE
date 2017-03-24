sap.ui.define( [ "js/core/Controller", "sap/ui/model/json/JSONModel", "sap/ui/model/odata/v2/ODataModel" ], function(
	Controller, JSONModel, ODataModel ) {
	"use strict";

	return Controller.extend( "js.ui.appchart", {

		/**
		 * List of numbers of values to be shown in the chart. Will be shown as radio buttons.
		 */
		SHOWN_VALUE_COUNTS: (function() {
			var shownValueCounts = [ 10, 50, 100, 250, 500 ];
			/**
			 * Converts a shownValueCounts value to its index in shownValueCounts and back. For use with
			 * 'selectedIndex' in lists or radio button groups.
			 */
			sap.ui.model.SimpleType.extend( "odataconsumption.ShownValueCountToIndexConverter", {
				parseValue: function( index ) {
					return shownValueCounts[index];
				},
				formatValue: function( count ) {
					return shownValueCounts.indexOf( count );
				},
				validateValue: function( count ) {
					return shownValueCounts.indexOf( count ) !== -1;
				}
			} );
			return shownValueCounts;
		})(),

		/**
		 * The update interval of the chart, if auto refresh is enabled.
		 */
		CHART_UPDATE_INTERVAL: 1000,

		_iIntervalId: null,
		_oViewModel: null,
		_oDeviceModel: null,
		_oDeviceTypesModel: null,
		_oDataModel: null,
		_oMeasureModel: null,
		_oChartModel: null,
		_oLoadModelPromise: null,
		_sTimeAxisPath: null,
		_sTimeAxisSelectionControlId: 'timeMeasureSelection',
		_sMeasureSelectionControlId: 'measureSelection',

		/**
		 * This function is automatically called on startup
		 */
		onInit: function() {
			var router = this.getRouter();
			router.getRoute( 'appdatachart' ).attachPatternMatched( this.onRouteMatched, this );
			router.getRoute( 'appdatachartdevices' ).attachPatternMatched( this.onRouteMatched, this );

			// Create models
			this._oViewModel = this.createViewModel();
			this._oViewModel.setProperty( '/shownValueCounts', this.SHOWN_VALUE_COUNTS );
			this._oViewModel.setProperty( '/shownValueCount', this.SHOWN_VALUE_COUNTS[0] );
			this._oDataModel = this.createODataModel();
			this._oDeviceModel = new JSONModel();
			this._oDeviceTypesModel = new JSONModel();
			this._oMeasureModel = new JSONModel();
			this._oChartModel = new JSONModel();

			// Set models to view
			this.getView().setModel( this._oViewModel, "viewModel" );
			this.getView().setModel( this._oDeviceModel, "devices" );
			this.getView().setModel( this._oDeviceTypesModel, "deviceTypes" );
			this.getView().setModel( this._oMeasureModel, "measure" );
			this.getView().setModel( this._oDataModel, "odata" );
			this.getView().setModel( this._oChartModel, "chart" );

			var oVizFrame = this.getView().byId( 'idVizFrame' );
			oVizFrame.setModel( this._oChartModel );

			// Wait until all promises are resolved and set default selection
			this._oLoadModelPromise = this.loadRDMSModels( this._oDeviceModel );
		},

		onRouteMatched: function( oEvent ) {
			var oParameters = oEvent.getParameters();

			this._oLoadModelPromise.then( function( mDevices ) {
				if ( mDevices.length > 0 ) {
					var sDeviceId = null;
					if ( oParameters.name === 'appdatachart' ) {
						sDeviceId = this._oViewModel.getProperty( '/selectedDeviceId' ) || mDevices[0].id;
					} else if ( oParameters.name === 'appdatachartdevices' ) {
						sDeviceId = oParameters.arguments.deviceid;
					}
					this.changeDevice( sDeviceId );

					// (re)start auto refresh timer, if auto refresh is set
					if ( this._oViewModel.getProperty( '/autoRefresh' ) ) {
						this.startAutoRefresh();
					}
				}
			}.bind( this ) );
		},

		/**
		 * Refesh the RDMS models and adapt the selected device, if necessary.
		 */
		onRefreshDevicesPressed: function( evt ) {
			var selectedDeviceId = this._oViewModel.getProperty( '/selectedDeviceId' );
			this.loadRDMSModels( this._oDeviceModel ).then( function( mDevices ) {
				// check, if the selected device is still available
				for ( var i = 0; i < mDevices.length; i++ ) {
					if ( mDevices[i].id === selectedDeviceId ) {
						return;
					}
				}
				// if the device has been deleted, select another device
				if ( mDevices.length > 0 ) {
					// Set selection to first device
					this.changeDevice( mDevices[0].id );
				}
			}.bind( this ) );
		},

		/**
		 * Eventhandler that is called when the user selects a different device
		 * 
		 * @param oEvent
		 */
		onDeviceSelectionChange: function( oEvent ) {
			var oSelectedItem = oEvent.getParameter( "selectedItem" );
			var sId = oSelectedItem.getKey();

			var bNoHistoryEntry = false;
			this.getRouter().navTo( 'appdatachartdevices', {
				deviceid: sId
			}, bNoHistoryEntry );
		},

		/**
		 * Eventhandler that is called when the user selects a different message type
		 * 
		 * @param oEvent
		 */
		onMessageTypeSelectionChange: function( oEvent ) {
			var oSelectedItem = oEvent.getParameter( "selectedItem" );
			var sId = oSelectedItem.getKey();
			// Set selected message type
			this._oViewModel.setProperty( '/selectedMessageTypeId', sId );

			var aMessageTypes = this._oViewModel.getProperty( '/messageTypes' );
			var mFilteredMessageTypes = aMessageTypes.filter( function( next ) {
				return sId === next.id;
			} );

			this.initTimeAxisSelectionControl( mFilteredMessageTypes[0] );
			this.initMeasuresSelectionControl( mFilteredMessageTypes[0] );
		},

		/**
		 * Eventhandler that is called when the user selects a different time axis field
		 * 
		 * @param oEvent
		 */
		onTimeAxisSelectionChange: function( oEvent ) {
			this.initChart();
		},

		/**
		 * Adapt value state of the measure selection control and redraw the chart according to the selected
		 * measures.
		 * 
		 * @param oEvent
		 */
		onMeasureSelectionChanged: function( oEvent ) {
			this.updateMeasuresValidationState();
			this.initChart();
		},

		/**
		 * Set or clear the automatic chart data update.
		 */
		onAutoRefreshChanged: function() {
			if ( this.getView().byId( 'autoRefreshSwitch' ).getState() ) {
				this.startAutoRefresh();
			} else {
				this.stopAutoRefresh();
			}
		},

		/**
		 * Start timer for chart auto refresh and attach a route matched listener to stop chart refresh on
		 * navigation to another view.
		 */
		startAutoRefresh: function() {
			if ( !this._iIntervalId ) {
				this._iIntervalId = setInterval( this.updateChartData.bind( this ), this.CHART_UPDATE_INTERVAL );
				// listen to route matched events to stop auto refresh on navigation to another view
				this.getRouter().attachRouteMatched( this.stopAutoRefresh, this );

				this.updateChartData();
			}
		},

		/**
		 * If set, clear timer for chart auto refresh, and detach route matched listener.
		 */
		stopAutoRefresh: function() {
			if ( this._iIntervalId ) {
				clearInterval( this._iIntervalId );
				this._iIntervalId = null;
				// detach listener to avoid unncessary activities, when the view is not visible
				this.getRouter().detachRouteMatched( this.stopAutoRefresh, this );
			}
		},

		/**
		 * Reload chart data to adapt to the chosen number of values to be shown.
		 * 
		 * @param oEvent
		 */
		onShownValueCountChanged: function( oEvent ) {
			this.updateChartData();
		},

		/**
		 * Should be called when the device ID changes
		 * 
		 * @param sId the ID of a device
		 */
		changeDevice: function( sId ) {
			var oDevice = this.getDeviceById( sId );
			var oDeviceType = oDevice.deviceType;

			this._oViewModel.setProperty( '/selectedDeviceId', oDevice.id );
			this._oViewModel.setProperty( '/messageTypes', oDeviceType.messageTypes );

			if ( oDeviceType.messageTypes.length > 0 ) {
				this._oViewModel.setProperty( '/selectedMessageTypeId', oDeviceType.messageTypes[0].id );
				this.initTimeAxisSelectionControl( oDeviceType.messageTypes[0] );
				this.initMeasuresSelectionControl( oDeviceType.messageTypes[0] );
			} else {
				this._oViewModel.setProperty( '/selectedMessageTypeId', "" );
				this.initTimeAxisSelectionControl( null );
				this.initMeasuresSelectionControl( null );
			}
		},

		/**
		 * Get the deviceType by ID from the deviceType model
		 * 
		 * @param sId the id of a device
		 * @returns {DeviceType}
		 */
		getDeviceTypeById: function( sId ) {
			var mDeviceTypes = this._oDeviceTypesModel.getData();
			var mFilteredDeviceTypes = mDeviceTypes.filter( function( next ) {
				return sId === next.id;
			} );
			return mFilteredDeviceTypes[0];
		},

		/**
		 * Get the device by ID from the device model
		 * 
		 * @param sId the ID of a device
		 * @returns {Device}
		 */
		getDeviceById: function( sId ) {
			var mDevices = this._oDeviceModel.getData();
			var mFilteredDevices = mDevices.filter( function( next ) {
				return sId === next.id;
			} );
			return mFilteredDevices[0];
		},

		/**
		 * Get the message type by ID from the view model
		 * 
		 * @param sId the ID of a message type
		 * @returns {MessageType}
		 */
		getMessageTypeById: function( sId ) {
			var aMessageTypes = this._oViewModel.getProperty( '/messageTypes' );
			var mFilteredMessageTypes = aMessageTypes.filter( function( next ) {
				return sId === next.id;
			} );
			return mFilteredMessageTypes[0];
		},

		/**
		 * Returns true when specified field is time based
		 * 
		 * @param oField a field of a message type
		 * @returns boolean
		 */
		isTimeField: function( oField ) {
			return oField.type === "date"
		},

		/**
		 * Returns true when specified field is not time based
		 * 
		 * @param oField a field of a message type
		 * @returns boolean
		 */
		isNoTimeField: function( oField ) {
			return oField.type !== "date";
		},

		/**
		 * Set all message fields that can be used as measures in the chart.
		 * 
		 * @param oMessageType a instance of a MessageType
		 */
		initTimeAxisSelectionControl: function( oMessageType ) {
			var timeMeasureSelection = this.getView().byId( this._sTimeAxisSelectionControlId );

			if ( oMessageType ) {
				// filtering the timestamp field because it will be displayed on the X-Axis
				var fields = oMessageType.fields.filter( this.isTimeField );
				// add "created time" column to the list
				fields.push( {
					position: 0,
					name: "created",
					type: "date"
				} )
				this._oViewModel.setProperty( "/timeMeasures", fields );

				// retrieve items to select first one as default
				var items = timeMeasureSelection.getItems();
				timeMeasureSelection.setSelectedItem( items[0] );
			} else {
				this._oViewModel.setProperty( "/timeMeasures", [] );
				timeMeasureSelection.setSelectedItem( null );
			}
		},

		/**
		 * Set all message fields that can be used as measures in the chart.
		 * 
		 * @param oMessageType a instance of a MessageType
		 */
		initMeasuresSelectionControl: function( oMessageType ) {
			var measureSelection = this.getView().byId( this._sMeasureSelectionControlId );
			var aNewSelectedItems = [];

			if ( oMessageType ) {
				// filtering the timestamp field because it will be displayed on the X-Axis
				var fields = oMessageType.fields.filter( this.isNoTimeField );
				this._oViewModel.setProperty( "/measures", fields );
				var items = measureSelection.getItems();

				// define how many items should be selected as default
				var iMaxItemsToSelect = 5;
				if ( items.length < iMaxItemsToSelect ) {
					iMaxItemsToSelect = items.length;
				}

				for ( var i = 0; i < iMaxItemsToSelect; i++ ) {
					aNewSelectedItems[i] = items[i];
				}
			} else {
				this._oViewModel.setProperty( "/measures", [] );
			}

			// set selected items as default
			measureSelection.setSelectedItems( aNewSelectedItems );
			this.updateMeasuresValidationState();

			// update chart
			this.initChart();
		},

		/**
		 * Refreshs the validation state of the measure selection combobox depending on the current selected
		 * items
		 */
		updateMeasuresValidationState: function() {
			var oMeasureSelectedItems = this.getView().byId( this._sMeasureSelectionControlId ).getSelectedItems();
			var selectedMessageTypeId = this._oViewModel.getProperty( '/selectedMessageTypeId' );

			if ( selectedMessageTypeId
				&& (oMeasureSelectedItems === null || oMeasureSelectedItems === undefined || oMeasureSelectedItems.length < 1) ) {
				// show error validation only when a message type exists because current control is related to
				// previous selections. a validation error may confuse the user if he/she can not fix it
				this._oViewModel.setProperty( '/measureSelectionValueState', 'Error' );
			} else {
				this._oViewModel.setProperty( '/measureSelectionValueState', 'None' );
			}
		},

		/**
		 * Reload chart data. If no measures are selected, the call is ignored.
		 */
		updateChartData: function() {
			// if no measures are selected, skip loading data
			var oMeasureSelectedItems = this.getView().byId( this._sMeasureSelectionControlId ).getSelectedItems();
			if ( oMeasureSelectedItems.length < 1 ) {
				return;
			}

			var sDeviceId = this._oViewModel.getProperty( '/selectedDeviceId' );
			var sMessageTypeId = this._oViewModel.getProperty( '/selectedMessageTypeId' ).toUpperCase();
			var shownValueCount = this._oViewModel.getProperty( '/shownValueCount' );

			this._oDataModel.read( "/T_IOT_" + sMessageTypeId, {
				urlParameters: {
					"$top": shownValueCount
				},
				filters: [ new sap.ui.model.Filter( "G_DEVICE", sap.ui.model.FilterOperator.EQ, sDeviceId ) ],
				sorters: [ new sap.ui.model.Sorter( this._sTimeAxisPath, true ) ],
				success: function( oData, oResponse ) {
					var dataAvailable = oData.results.length > 0;
					this.showChart( dataAvailable );

					if ( dataAvailable ) {
						this._oChartModel.setData( oData.results );
					} else {
						this.resetChart();
					}
				}.bind( this ),
				error: function( oError ) {
					this.showChart( false );
					this.resetChart();
				}.bind( this )
			} );
		},

		/**
		 * Sets visibility of chart and 'no data'-label depending on given parameter.
		 * 
		 * @param dataAvailable indicate if chart or 'no data'-label should be visible
		 */
		showChart: function( dataAvailable ) {
			var oVizFrame = this.getView().byId( 'idVizFrame' );
			oVizFrame.setVisible( dataAvailable );
			var oLabel = this.getView().byId( 'noDataLabel' );
			oLabel.setVisible( !dataAvailable );
		},

		/**
		 * Removes any dimension and measure configuration. Also the viewmodel of the chart is set to null.
		 */
		resetChart: function() {
			this._oChartModel.setData( null );
			var oVizFrame = this.getView().byId( 'idVizFrame' );
			oVizFrame.destroyDataset();
			oVizFrame.destroyFeeds();
		},

		/**
		 * Initialize the chart to the current selected time axis and selected measures
		 */
		initChart: function() {
			// if no time axis or measure is selected, skip loading data
			var oTimeAxisSelectedItem = this.getView().byId( this._sTimeAxisSelectionControlId ).getSelectedItem();
			var oMeasureSelectedItems = this.getView().byId( this._sMeasureSelectionControlId ).getSelectedItems();

			if ( oTimeAxisSelectedItem === null || oTimeAxisSelectedItem === undefined
				|| oMeasureSelectedItems.length < 1 ) {
				this.showChart( false );
				this.resetChart();
				return;
			}

			var oVizFrame = this.getView().byId( 'idVizFrame' );

			// remove all feeds to ensure correct x and y axis configuration
			oVizFrame.removeAllFeeds();

			// define time axis settings
			var timeAxisName = oTimeAxisSelectedItem.getText();
			if ( timeAxisName === 'created' ) {
				this._sTimeAxisPath = "G_".concat( timeAxisName.toUpperCase() );
			} else {
				this._sTimeAxisPath = "C_".concat( timeAxisName.toUpperCase() );
			}

			oVizFrame.addFeed( new sap.viz.ui5.controls.common.feeds.FeedItem( {
				"uid": "timeAxis",
				"type": "Dimension",
				"values": timeAxisName
			} ) );

			var oDataset = new sap.viz.ui5.data.FlattenedDataset( {
				dimensions: [ {
					name: timeAxisName,
					value: {
						path: this._sTimeAxisPath,
						formatter: this.formatDate
					},
					dataType: "date"
				} ]
			} );
			oDataset.bindAggregation( "data", {
				path: "/"
			} );
			oVizFrame.setDataset( oDataset );

			// define measure settings
			var oPlainMeasures = [];
			for ( var i in oMeasureSelectedItems ) {
				oPlainMeasures[i] = oMeasureSelectedItems[i].getText();
				oDataset.addMeasure( new sap.viz.ui5.data.MeasureDefinition( {
					name: oPlainMeasures[i],
					value: "{C_".concat( oPlainMeasures[i].toUpperCase(), "}" )
				} ) );
			}

			oVizFrame.addFeed( new sap.viz.ui5.controls.common.feeds.FeedItem( {
				"uid": "primaryValues",
				"type": "Measure",
				"values": oPlainMeasures
			} ) );

			this.updateChartData();
		},

		/**
		 * Formats the date object that is shown in chart
		 * 
		 * @param oValue the value to be date formatted
		 * @returns {string} a date formatted string
		 */
		formatDate: function( oValue ) {
			var oDate = null;
			// can be of type Date if consumed with OData (XML format)
			if ( oValue instanceof Date ) {
				oDate = oValue;
			}
			// can be a string primitive in JSON, but we need a number
			else if ( (typeof oValue) === "string" ) {
				// can be of type JSON Date if consumed with OData (JSON format)
				if ( oValue.indexOf( "/" ) === 0 ) {
					oValue = oValue.replace( new RegExp( "/", 'g' ), "" );
					oValue = oValue.replace( new RegExp( "\\(", 'g' ), "" );
					oValue = oValue.replace( new RegExp( "\\)", 'g' ), "" );
					oValue = oValue.replace( "Date", "" );
					oValue = parseInt( oValue );
					oDate = new Date( oValue );
				} else {
					// backward compatibility, old type was long, new type is date
					// check if not a number
					var result = isNaN( Number( oValue ) );
					if ( result ) {
						// FF and Ie cannot create Dates using 'DD-MM-YYYY HH:MM:SS.ss' format but
						// 'DD-MM-YYYYTHH:MM:SS.ss'
						oValue = oValue.replace( " ", "T" );
						// this is a date type
						oDate = new Date( oValue );
					} else {
						// this is a long type
						oValue = parseInt( oValue );
						// ensure that UNIX timestamps are converted to milliseconds
						oDate = new Date( oValue * 1000 );
					}
				}
			} else {
				// ensure that UNIX timestamps are converted to milliseconds
				oDate = new Date( oValue * 1000 );
			}
			return oDate;
		},

		/**
		 * Formats the enablement of the select fields. If no data is found the select fields are disabled.
		 * 
		 * @param oValue the data that is shown in select
		 * @returns {boolean} false if select should be disabled else true
		 */
		formatSelectEnablement: function( oValue ) {
			if ( oValue === null || oValue === undefined || oValue.length === 0
				|| jQuery.isEmptyObject( oValue ) ) {
				return false;
			}
			return true;
		},

		/**
		 * Create a view model. This model holds all common information to keep the view running.
		 * 
		 * @returns {*}
		 */
		createViewModel: function() {
			var oModel = new JSONModel( {
				selectedDeviceId: "",
				selectedDeviceName: "",
				selectedMessageTypeId: "",
				measures: "",
				messageTypes: [],
				autoRefresh: false
			} );
			return oModel;
		},

		/**
		 * Creates the oData model to consume MMS
		 * 
		 * @returns {sap.ui.model.odata.v2.ODataModel}
		 */
		createODataModel: function() {
			var oModel = new ODataModel( this.getOwnerComponent().URL_HTTP_APP_SERVICE + ".svc" );
			return oModel;
		},

		/**
		 * Return a promise, which is resolved, when all models are loaded
		 */
		loadRDMSModels: function( deviceModel ) {
			var oDevicePromise = this.createModelPromise( deviceModel, this.getOwnerComponent().URL_RDMS_SERVICE_ALL_DEVICES );
			return oDevicePromise;
		},

		/**
		 * Create a promise that is resolved, when the model data are loaded.
		 * 
		 * @param oModel the device model
		 * @param sUri uri path to load the model data from
		 * @returns {Promise}
		 */
		createModelPromise: function( oModel, sUri ) {
			return new Promise( function( resolve, reject ) {
				oModel.attachRequestCompleted( function() {
					resolve( oModel.getData() );
				} );
				oModel.loadData( sUri );
			} );
		}
	} );
} );