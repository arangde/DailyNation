/**
 * Page - Settings / Terms of use
 */

(function() {'use strict';

	var page = app.registerPage('page-terms', {

		// initialize page layouts
		onPageInit: function() {
			iscroll = new iScroll($(this.getSelector() + " .wrapper")[0], {vScrollbar: false, useTransition: true});
		},

		// resize all elements according to the screen
		onResize: function() {
			var heightWindow = $(window).height();
			var heightHeader = $(this.getSelector() + " .ui-header").outerHeight();
			$(this.getSelector() + " .ui-content").outerHeight(heightWindow - heightHeader + 1);
			var height = $(this.getSelector() + " .ui-content").height();
			$(this.getSelector() + " .wrapper").height(height);
			if (iscroll != null) {
				iscroll.refresh();
			}
		},

		// called when the page becomes visible
		onPageShow: function() {
			this.onResize();
		},

		// called when the page becomes invisible
		onPageHide: function() {
		}
	});

	var iscroll = null;


})();

