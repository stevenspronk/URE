sap.ui.jsfragment( 'js.ui.fragment.header', {

	createContent: function( oController ) {
		// contentLeft
		var oContentLeft = this.contentLeft( oController );

		// contentRight
		var oContentRight = this.contentRight( oController );

		// contentMiddle
		var oContentMiddle = this.contentMiddle( oController );

		return new sap.m.Bar( {
			design: sap.m.BarDesign.Header,
			contentLeft: oContentLeft,
			contentMiddle: oContentMiddle,
			contentRight: oContentRight
		} );
	},

	contentLeft: function( oController ) {
		if ( (typeof oController.getContentLeft) !== 'function' ) {
			oController.getContentLeft = function() {
				return sap.ui.jsfragment( 'js.ui.fragment.back', oController );
			}
		}
		return oController.getContentLeft();
	},

	contentMiddle: function( oController ) {
		if ( (typeof oController.getContentMiddle) !== 'function' ) {
			oController.getContentMiddle = function() {

				if ( oController.getTitle() ) {
					return new sap.m.Title( {
						text: oController.getTitle()
					} );
				}

				return new sap.m.Title( {
					text: ""
				} );
			}
		}
		return oController.getContentMiddle();
	},

	contentRight: function( oController ) {
		if ( (typeof oController.getContentRight) !== 'function' ) {
			oController.getContentRight = function() {
				return [];
			};
		}
		return oController.getContentRight();
	}

} );