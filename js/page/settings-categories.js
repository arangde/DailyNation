/**
 * Page - Settings / Categories
 */

(function() {'use strict';

	var page = app.registerPage('page-settings-categories', {

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
		},

		// before creating page
		"$pagebeforecreate:#page-settings-categories": function() {
			loadSetting();
		},

		// change the category visible
		"$change:#page-settings-categories select": function(event, src) {
			var name = src.name;
			var value = src.value == "on";
			app.data.setSectionVisible(name, value);
		}
	});

	var iscroll = null;
	function loadSetting() {
		var sections = app.data.getAllSections();
		for (var i = 0; i < sections.length; i++) {
			var section = sections[i];
			if (app.data.isSectionVisible(section)) {
				$('#page-settings-categories select[name="' + section + '"] [value="on"]').attr("selected", "selected");
			} else {
				$('#page-settings-categories select[name="' + section + '"] [value="off"]').attr("selected", "selected");
			}
		}
	}

})();

