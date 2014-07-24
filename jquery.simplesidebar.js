//Simple Sidebar v0.0.1 by DcDeiv https://github.com/dcdeiv
// GPLv2 http://www.gnu.org/licenses/gpl-2.0-standalone.html
(function( $ ) {
	$.fn.simpleSidebar = function( options ) {
		//declaring all global variables
		var sbw, sbInitialPos, margins, nsbw,
			//allowing user customisation
			defaults  = {
				settings: {
					opener: undefined,
					wrapper: undefined, //HTML tag is not safe. Please, use a container/wrapper div
					ignore: undefined,
					data: 'ssbplugin',
					animation: {
						duration: 500, //milliseconds (0.5s = 500ms)
						easing: 'swing'
					}
				},
				sidebar: {
					align: undefined,
					width: 350, //pixels
					gap: 64, //pixels
					closingLinks: 'a',
					style: {
						zIndex: 3000
					}
				},
				mask: {
					style: {
						backgroundColor: 'grey',
						opacity: 0.5,
						filter: 'Alpha(opacity=50)' //IE8 and earlier
					}
				}
			},
			config    = $.extend( true, defaults, options ),
			$sidebar  = this,
			$opener   = $( config.settings.opener ),
			$wrapper  = $( config.settings.wrapper ),
			$ignore   = $( config.settings.ignore ),
			dataName  = config.settings.data,
			duration  = config.settings.animation.duration,
			easing    = config.settings.animation.easing,
			align     = config.sidebar.align,
			sbMaxW    = config.sidebar.width,
			gap       = config.sidebar.gap,
			$links    = config.sidebar.links,
			defStyle  = config.sidebar.style,
			maskStyle = config.mask.style,
			winMaxW   = sbMaxW + gap,
			//selecting all fixed elements except the sidebar and the ignore elements
			$fixedEl  = $( '*' )
				.not( $ignore )
				.not( $sidebar )
				.filter(function() {
					return $( this ).css( 'position' ) == 'fixed';
				}),
			//selecting all elements.
			$elements = $fixedEl
				.add( $sidebar )
				.add( $wrapper )
				.not( $ignore ),
			w         = $( window ).width();
			
		//Appending to 'body' the mask-div and adding its style
		var maskDiv = $( 'body' ).children().filter(function(){
			return $( this ).data( dataName ) === 'mask' ;
		});
		
		maskDiv
			//default style by user
			.css( maskStyle )
			//style properties that cannot be ovverriden
			.css({
				//mask-div is positioned with a negative integer for a bug in mobile browsers. On scrolling the page, the div will move as the browser-navigation-bar appears (Chrome Mobile, Opera Mobile, Firefox Mobile)
				position: 'fixed',
				top: -200,
				right: -200,
				left: -200,
				bottom: -200,
				//setting the z-index to 1 level below the sidebar so that it will overlay the page but not the sidebar
				zIndex: config.sidebar.style.zIndex - 1 })
			//hiding the mask-div. This element will be triggered only when the sidebar will be opened.
			.hide();
		
		//assining a value to sbw global variable
		if ( w < winMaxW ) {
			sbw = w - gap;
		} else {
			sbw = sbMaxW;
		}
		
		//checking config.sidebar.align and positioning the sidebar according to options. Assining value to ALIGN variable.
		if( undefined === align || 'left' === align ) {
			margins      = {
				marginLeft: '-=' + nsbw,
				marginRight: '+=' + nsbw
			};
			sbInitialPos = {
				position: 'fixed',
				top: 0,
				left: 0,
				bottom: 0,
				width: sbw,
				maxWidth: sbw,
				marginLeft: -sbw
			};
		} else if ( 'right' === align ) {
			margins      = {
				marginRight: '-=' + nsbw,
				marginLeft: '+=' + nsbw
			};
			sbInitialPos = {
				position: 'fixed',
				top: 0,
				bottom: 0,
				right: 0,
				width: sbw,
				maxWidth: sbw,
				marginright: -sbw
			};
		}
		
		$sidebar
			//allowing customisation
			.css( defStyle )
			//didn't merge the two .css methods because sbInitialPos must not be overriden.
			.css( sbInitialPos )
			//wrapping inner content to let it overflow. It does not work with ajax. So If content is ajax. the .load function must be triggered with an internal div/span element. ex: <div id="sidebar"> <span/div class="load-ajax"></span> </div>
			.wrapInner( '<div data-' + dataName + '="sub-wrapper">' );
		
		var subWrapper = $sidebar.children().filter(function() {
			return $( this ).data( dataName ) === 'sub-wrapper' ;
		});
		
		//This style will let content overflow if it will be bigger than the sidebar
		subWrapper.css({
			width: '100%',
			height: '100%',
			overflow: 'auto'
		});
		
		//This function will open the sidebar
		var animateStart = function() {
			var nsbw = $sidebar.width();
			
			$( 'body, html' ).css({
				overflow: 'hidden'
			});
			
			$elements.animate( margins, {
				duration: duration,
				easing: easing,
				complete: function() {
					maskDiv.fadeIn();
				}
			});
		},
			//This function will close the sidebar
			animateReset  = function() {
				var nsbw = $sidebar.width();
				
				$elements.animate( margins, {
					duration: duration,
					easing: easing,
					complete: function() {
						maskDiv.fadeOut();
						$( 'body, html' ).css({
							overflow: 'auto'
						});
					}
				});
			};
			
		$opener.click( animateStart );
		maskDiv.add( $links )
			.click( animateReset );
			
	};
})(jQuery);