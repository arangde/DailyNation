
/**
 * Initialize application
 */

(function() {'use strict';

	// Initialize application
	if (Util.isCordova()) {
		// cordova version
		document.addEventListener("deviceready", function() {
			app.initialize();
			onSizeChange();
		});
	} else {
		// not cordova version
		$(document).ready(function() {
			$(window).load(function() {
				setTimeout(function() {
					app.initialize();
					onSizeChange();
				}, 1);
			});
		});
	}

	// Prevent default phone bounce behavior
	document.addEventListener('touchmove', function(e) {
		e.preventDefault();
	}, false);
	// adjust rem root size
	function onResetREM() {
		$(document.documentElement).css("font-size", ($(window).width() / 100) + "px");
	}
	onResetREM();
	function onSizeChange() {
		onResetREM();
		// invoke page onResize event
		for (var pageId in app.getController().mobilePages) {
			var page = app.getController().mobilePages[pageId];
			if (page.onResize != null) {
				page.onResize();
			}
		}
	}
	window.onresize = onSizeChange;
})();
