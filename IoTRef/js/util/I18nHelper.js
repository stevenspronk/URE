sap.ui.define( [ 'sap/ui/base/Object' ], function( BaseObject ) {
	'use strict';
	var I18nHelper = BaseObject.extend( 'js.util.I18nHelper', {

		/**
		 * Default UI language
		 */
		DEFAULT_LANGUAGE: 'en',

		/**
		 * The name of the mms locale file
		 */
		_localeMMSName: 'i18n',

		/**
		 * The name of the mms locale file for NOTR links
		 */
		_localeMMSLinksName: 'links',

		/**
		 * The name of the i18n model
		 */
		_i18nModelName: 'i18n',

		/**
		 * A reference to the resource model
		 */
		_i18nResourceModels: [],

		/**
		 * A reference to the component to which the resource model is applied
		 */
		_oComponent: null,

		/**
		 * A reference to the eventbus to communicate I18n events
		 */
		_oEventBus: null,

		/**
		 * The channel name
		 * 
		 * @type {String}
		 */
		_sChannelName: 'I18nHelperChannel',

		/**
		 * The event that is passed in the channel in order to communicate resource model changes
		 * 
		 * @type {String}
		 */
		_sChannelEvent: 'changed',

		/**
		 * Create the i18n helper class
		 * 
		 * @constructor
		 */
		constructor: function() {
			this._oEventBus = sap.ui.getCore().getEventBus();
		},

		/**
		 * This is a virtual constructor which must be called in the component
		 * 
		 * @param oComponent a reference to the component to which the i18n model should be applied
		 */
		init: function( oComponent ) {
			this._oComponent = oComponent;
			this._addResourceModels( oComponent.URL_FRAGMENT_SERVICE );
		},

		/**
		 * Set the resource model to the component
		 * 
		 * @param sModelName the name of the resource model
		 * @param oResourceModel the resource model
		 */
		addResourceModel: function( sModelName, oResourceModel ) {
			if ( sModelName && oResourceModel ) {
				this._i18nResourceModels.push( {
					name: sModelName,
					model: oResourceModel
				} );

				this._oComponent.setModel( oResourceModel, sModelName );
				this._oEventBus.publish( this._sChannelName, this._sChannelEvent );
			}
		},

		/**
		 * Get a tag from the i18n resource bundle
		 * 
		 * @param i18nTag the id of a i18n entry
		 * @param args additional parameters to set arguments for a i18n entry
		 * @returns {string|*}
		 */
		getI18nText: function( i18nTag, args ) {
			return this.getText( this._i18nModelName, i18nTag, args );
		},

		/**
		 * Get a tag from the resource bundle identified by name. Note that this method does not prevent you
		 * from accessing a resource model which is not currently loaded.
		 * 
		 * @param sModelName the name of the model
		 * @param i18nTag the id of a i18n entry
		 * @param args additional parameters to set arguments for a i18n entry
		 * @returns {string|*}
		 */
		getText: function( sModelName, i18nTag, args ) {
			for ( var i = 0; i < this._i18nResourceModels.length; i++ ) {
				if ( this._i18nResourceModels[i].name === sModelName ) {
					return this._i18nResourceModels[i].model.getResourceBundle().getText( i18nTag, args );
				}
			}
		},

		/**
		 * Get a tag from a resource bundle identified by name. This method is independent from loading order
		 * because it notifies by promise when the bundle is available.
		 * 
		 * @param sModelName the name of the model
		 * @param i18nTag the id of a i18n entry
		 * @param args additional parameters to set arguments for a i18n entry
		 * @returns {string|*}
		 */
		getTextPromise: function( sModelName, i18nTag, args ) {
			return new Promise(
				function( resolve, reject ) {
					var bFound = false;

					for ( var i = 0; i < this._i18nResourceModels.length; i++ ) {
						if ( this._i18nResourceModels[i].name === sModelName ) {
							resolve( this._i18nResourceModels[i].model.getResourceBundle().getText( i18nTag, args ) );
							bFound = true;
							break;
						}
					}

					if ( bFound == false ) {
						var handleEvent = function( channel, event, data ) {
							for ( var i = 0; i < this._i18nResourceModels.length; i++ ) {
								if ( this._i18nResourceModels[i].name === sModelName ) {
									resolve( this._i18nResourceModels[i].model.getResourceBundle().getText( i18nTag, args ) );
									this._oEventBus.unsubscribe( this._sChannelName, this._sChannelEvent );
								}
							}
						}

						this._oEventBus.subscribe( this._sChannelName, this._sChannelEvent, handleEvent, this );
					}
				}.bind( this ) );
		},

		/**
		 * Sets the i18n Model to the component and extends this model with loaded fragments
		 * 
		 * @param sUrlFragmentService the fragments service url
		 * @private
		 */
		_addResourceModels: function( sUrlFragmentService ) {
			// Load MMS properties immediately
			var oResourceModel = this._createResourceModel( this._getPath( this._localeMMSName ) );
			oResourceModel.enhance( {
				bundleUrl: this._getPath( this._localeMMSLinksName )
			} )
			this.addResourceModel( this._i18nModelName, oResourceModel );

			// Load fragments
			this._addMissingFragments( sUrlFragmentService );
		},

		/**
		 * Get the resource model of the given locale file
		 * 
		 * @param sUrl the path of the locale file
		 * @private
		 */
		_createResourceModel: function( sUrl ) {
			var oModel = new sap.ui.model.resource.ResourceModel( {
				bundleUrl: sUrl
			} );

			return oModel;
		},

		/**
		 * Requests the url and extracts used fragments
		 * 
		 * @param sUrl the name of the url
		 * @private
		 */
		_addMissingFragments: function( sUrl ) {
			var that = this;
			var oSuccessHandler = function( oData ) {
				for ( var i = 0; i < oData.length; i++ ) {
					var oService = oData[i];
					var sFragmentName = oService.name.toLowerCase();

					var oResourceModel = that._createResourceModel( that._getPath( sFragmentName ) );
					that.addResourceModel( sFragmentName, oResourceModel );
				}
			};

			var oErrorHandler = function( jqXHR ) {
				jQuery.sap.log.error( '_addMissingFragments(sUrl)', jqXHR.status + ' ' + jqXHR.statusText, 'I18nHelper.js' );
			};

			AjaxHelper.doAjaxGet( sUrl, oSuccessHandler, oErrorHandler );
		},

		/**
		 * Get the path of the locale file
		 * 
		 * @param sFragmentName the name of the fragment containing the locale file
		 * @returns {string}
		 * @private
		 */
		_getPath: function( sFragmentName ) {
			return 'locale/' + sFragmentName + '.properties';
		}
	} );

	// Attach helper to root
	window.I18nHelper = window.I18nHelper || new I18nHelper();
} );
