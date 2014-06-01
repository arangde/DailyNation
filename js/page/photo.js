/**
 * Page - Photo
 */

(function() {'use strict';

	var page = app.registerPage('page-photo', {

		// resize all elements according to the screen
		onResize: function() {
			var heightWindow = $(window).height();
			var heightHeader = find(".ui-header").outerHeight();
			var heightFooter = find(".ui-footer").outerHeight();
			find(".contents").css("height", heightWindow - heightHeader - heightFooter - 65);
		},

		// called when the page becomes visible
		onPageShow: function() {

			this.onResize();

			photos = app.data.getPhotos();
			var html = "<div>";
			for (var i = 0; i < photos.length; i++) {
				var item = photos[i];
				html += "<img src='" + item.photo.path + "'>";
			}
			html += "</div>";
			find(".contents").html(html);

			slider = find(".contents > div");
			slider.fotorama({
				width: $(window).width(),
				height: $(window).height(),
				nav: "thumbs",
				thumbwidth: 150,
				thumbheight: 150,
				thumbmargin: 0,
				thumbborderwidth: 0,
				glimpse: 0,
				navposition: 'top',
				allowfullscreen: 'true',
				customnavpaddingleft: 0,
				fit: 'none',
				arrows: 'false',
				shadows: 'true'
			});

			slider.on("fotorama:show", function(event) {
				updateTitle();
			});
			updateTitle();

		},

		// called when the page becomes invisible
		onPageHide: function() {
			find(".contents").html("");
		}
	});


	function find(s) {
		return page.find(s);
	}

	var photos = null;
	var slider = null;
	function updateTitle() {
		var index = slider.data('fotorama').activeIndex;
		var item = photos[index];
		find(".info .title").html(item.title);
		find(".info .description").html(item.photo.caption);
	}

})();

