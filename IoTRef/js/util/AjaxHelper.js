sap.ui.define( [ 'sap/ui/base/Object', 'sap/m/BusyDialog' ], function( BaseObject, BusyDialog ) {
	'use strict';
	var AjaxHelper = BaseObject.extend( 'js.util.AjaxHelper', {

		/**
		 * Create the ajax helper class
		 * 
		 * @constructor
		 */
		constructor: function() {
			this._csrfToken = null;

			this._oBusyDialog = new BusyDialog( {
				busyIndicatorDelay: 1000
			} );
		},

		/**
		 * This method is invoked by Eventbus before the ajax request is executed
		 */
		onBeforeAjax: function( sChannelId, sEventId, oData ) {
			this._oBusyDialog.open();
		},

		/**
		 * This method is invoked by Eventbus before the ajax request is executed
		 */
		onAfterAjax: function( sChannelId, sEventId, oData ) {
			this._oBusyDialog.close();
		},

		/**
		 * GET the base url of MMS
		 * 
		 * @returns {string}
		 */
		getBaseUrl: function() {
			var sProtocol = window.location.protocol;
			var sHost = window.location.host;
			var sContext = window.location.pathname;
			sContext = sContext.split( "/" )[1];
			if ( sContext.trim().length == 0 ) {
				return sProtocol.concat( '//', sHost );
			}
			return sProtocol.concat( '//', sHost, '/', sContext );
		},

		/**
		 * This method is used to do POST-Requests
		 * 
		 * @param sUrl the destination of the request
		 * @param successHandler the handler that is executed if the request was successful
		 * @param errorHandler the handler that is executed if the request failed
		 * @param oSettings a object set query specific properties
		 */
		doAjaxPost: function( sUrl, successHandler, errorHandler, oSettings ) {
			this._doAjaxHttp( 'POST', sUrl, successHandler, errorHandler, oSettings );
		},

		/**
		 * This method is used to do PUT-Requests
		 * 
		 * @param sUrl the destination of the request
		 * @param successHandler the handler that is executed if the request was successful
		 * @param errorHandler the handler that is executed if the request failed
		 * @param oSettings a object set query specific properties
		 */
		doAjaxPut: function( sUrl, successHandler, errorHandler, oSettings ) {
			this._doAjaxHttp( 'PUT', sUrl, successHandler, errorHandler, oSettings );
		},

		/**
		 * This method is used to do DELETE-Requests
		 * 
		 * @param sUrl the destination of the request
		 * @param successHandler the handler that is executed if the request was successful
		 * @param errorHandler the handler that is executed if the request failed
		 * @param oSettings a object set query specific properties
		 */
		doAjaxDelete: function( sUrl, successHandler, errorHandler, oSettings ) {
			this._doAjaxHttp( 'DELETE', sUrl, successHandler, errorHandler, oSettings );
		},

		/**
		 * This method is used to do POST-Requests for a file upload
		 * 
		 * @param sUrl the destination of the request
		 * @param successHandler the handler that is executed if the request was successful
		 * @param errorHandler the handler that is executed if the request failed
		 * @param oSettings a object set query specific properties
		 */
		doAjaxFileUpload: function( sUrl, successHandler, errorHandler, oSettings ) {
			oSettings.contentType = false;
			oSettings.cache = false;
			oSettings.processData = false;
			this.doAjaxPost( sUrl, successHandler, errorHandler, oSettings );
		},

		/**
		 * This method is used to do GET-Requests
		 * 
		 * @param sUrl the destination of the request
		 * @param successHandler the handler that is executed if the request was successful
		 * @param errorHandler the handler that is executed if the request failed
		 * @param oSettings a object to handle GET specific properties like busyIndicator
		 */
		doAjaxGet: function( sUrl, successHandler, errorHandler, beforeHandler, afterHandler, oSettings ) {
			var that = this;
			if ( sUrl === null || sUrl === undefined || sUrl.trim() === '' ) {
				return;
			}

			if ( typeof (successHandler) !== 'function' ) {
				successHandler = function( oData, textStatus, jqXHR ) {
					jQuery.sap.log.info( oData );
				};
			}

			if ( typeof (errorHandler) !== 'function' ) {
				errorHandler = function( jqXHR, textStatus, errorThrown ) {
					jQuery.sap.log.error( '[' + jqXHR.status + '] ' + jqXHR.statusText );
				};
			}

			if ( oSettings === null || oSettings === undefined ) {
				oSettings = {
					busyIndicator: false,
					cache: false
				};
			}

			if ( oSettings.busyIndicator === undefined ) {
				oSettings.busyIndicator = false;
			}

			if ( oSettings.cache === undefined ) {
				oSettings.cache = false;
			}

			jQuery.ajax( {
				type: 'GET',
				cache: oSettings.cache,
				url: sUrl,
				beforeSend: function( jqXHR, settings ) {
					jqXHR.setRequestHeader( 'Accept-Language', sap.ui.getCore().getConfiguration().getLanguage() );

					if ( oSettings.busyIndicator ) {
						that._oBusyDialog.open();
					}

					if ( typeof (beforeHandler) === 'function' ) {
						beforeHandler.apply( that, [ jqXHR, settings ] );
					}
				},
				error: function( jqXHR, textStatus, errorThrown ) {
					errorHandler.apply( that, [ jqXHR, textStatus, errorThrown ] );
				},
				success: function( oData, textStatus, jqXHR ) {
					successHandler.apply( that, [ oData, textStatus, jqXHR ] );
				},
				complete: function( jqXHR, textStatus ) {
					if ( oSettings.busyIndicator ) {
						that._oBusyDialog.close();
					}

					if ( typeof (afterHandler) === 'function' ) {
						afterHandler.apply( that, [ jqXHR, textStatus ] );
					}
				}
			} );
		},

		/**
		 * Execute a specific HTTP request
		 * 
		 * @param sType the type of the HTTP request e.q. PUT/POST/DELETE
		 * @param sUrl the destination of the request
		 * @param successHandler the handler that is executed if the request was successful
		 * @param errorHandler the handler that is executed if the request failed
		 * @param oSettings a object set query specific properties
		 * @private
		 */
		_doAjaxHttp: function( sType, sUrl, successHandler, errorHandler, oSettings ) {
			this._doAjaxHttpRetry( sType, sUrl, successHandler, errorHandler, oSettings, true );
		},

		/**
		 * Execute a specific HTTP request
		 * 
		 * @param sType the type of the HTTP request e.q. PUT/POST/DELETE
		 * @param sUrl the destination of the request
		 * @param successHandler the handler that is executed if the request was successful
		 * @param errorHandler the handler that is executed if the request failed
		 * @param oSettings a object set query specific properties
		 * @param retry if set to true the request is send again if request fails with 403
		 * @private
		 */
		_doAjaxHttpRetry: function( sType, sUrl, successHandler, errorHandler, oSettings, retry ) {
			var that = this;
			if ( sType === null || sType === undefined || sType.trim() === '' ) {
				return;
			}
			if ( sUrl === null || sUrl === undefined || sUrl.trim() === '' ) {
				return;
			}
			if ( typeof (successHandler) !== 'function' ) {
				successHandler = function( oData, textStatus, jqXHR ) {
					jQuery.sap.log.info( oData );
				};
			}
			if ( typeof (errorHandler) !== 'function' ) {
				errorHandler = function( jqXHR, textStatus, errorThrown ) {
					jQuery.sap.log.error( '[' + jqXHR.status + '] ' + jqXHR.statusText );
				};
			}
			if ( oSettings === null || oSettings === undefined ) {
				oSettings = {
					contentType: 'application/json',
					data: null,
					cache: true,
					busyIndicator: false,
					processData: true
				};
			}
			if ( retry == null || retry === undefined ) {
				retry = true;
			}
			if ( oSettings.data === undefined ) {
				oSettings.data = null;
			}
			if ( oSettings.contentType === undefined ) {
				oSettings.contentType = 'application/json';
			}
			if ( oSettings.cache === undefined ) {
				oSettings.cache = true;
			}
			if ( oSettings.busyIndicator === undefined ) {
				oSettings.busyIndicator = false;
			}
			if ( oSettings.processData === undefined ) {
				oSettings.processData = true;
			}

			var oData = null;

			if ( oSettings.contentType === 'application/json' && oSettings.data instanceof Object ) {
				oData = JSON.stringify( oSettings.data );
			} else {
				oData = oSettings.data;
			}

			jQuery.ajax( {
				type: sType,
				url: sUrl,
				contentType: oSettings.contentType,
				data: oData,
				processData: oSettings.processData,
				cache: oSettings.cache,
				beforeSend: function( jqXHR, settings ) {
					if ( oSettings.busyIndicator ) {
						that._oBusyDialog.open();
					}
					if ( that._csrfToken === null ) {
						that._fetchCsrfToken();
					}
					jqXHR.setRequestHeader( 'Accept-Language', sap.ui.getCore().getConfiguration().getLanguage() );
					jqXHR.setRequestHeader( 'X-CSRF-Token', that._csrfToken );
				},
				error: function( jqXHR, textStatus, errorThrown ) {
					// HTTP 403 is handled separately
					if ( jqXHR.status === 403 ) {
						return;
					}
					errorHandler.apply( that, [ jqXHR, textStatus, errorThrown ] );
				},
				statusCode: {
					403: function( jqXHR, textStatus, errorThrown ) {
						if ( jqXHR === null || jqXHR === undefined || jqXHR.responseText === null
							|| jqXHR.responseText === undefined ) {
							return;
						}
						if ( jqXHR.responseText.indexOf( 'CSRF' ) !== -1 ) {
							// set CSRF_TOKEN back to null
							that._resetCsrfToken();
							// try the request out again
							if ( retry ) {
								that._doAjaxHttp( sType, sUrl, successHandler, errorHandler, oSettings, false );
							}
						}
					}
				},
				success: function( oData, textStatus, jqXHR ) {
					successHandler.apply( that, [ oData, textStatus, jqXHR ] );
				},
				complete: function( jqXHR, textStatus ) {
					if ( oSettings.busyIndicator ) {
						that._oBusyDialog.close();
					}
				}
			} );
		},

		/**
		 * GET a CSRF token
		 * 
		 * @private
		 */
		_fetchCsrfToken: function() {
			// CSRF token is requested against static resource, we
			// make sure that browser does not cache this call
			var timestamp = new Date().getTime();

			var oXMLHttpRequest = new XMLHttpRequest();

			oXMLHttpRequest.open( 'GET', 'csrf'.concat( '?_timestamp=', timestamp ), false );
			oXMLHttpRequest.setRequestHeader( 'X-CSRF-Token', 'Fetch' );
			oXMLHttpRequest.send();

			if ( oXMLHttpRequest.status == 404 ) {
				this._csrfToken = 'noauth';
			} else {
				this._csrfToken = oXMLHttpRequest.getResponseHeader( 'X-CSRF-Token' );
			}
		},

		/**
		 * Resets the CSRF token
		 * 
		 * @private
		 */
		_resetCsrfToken: function() {
			this._csrfToken = null;
		}
	} );

	window.AjaxHelper = window.AjaxHelper || new AjaxHelper();
} );