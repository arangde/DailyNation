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

			var w = find(".gallery-item").width();
			find(".gallery-item").height(w*0.66);
		},

		// called when the page becomes visible
		onPageShow: function(e) {

			photos = app.data.getPhotos();
			var html = "<div class='gallery-row'>";
			for (var i = 0; i < photos.length; i++) {
				var item = photos[i];
				html += '<div class="gallery-item"><a href="' + item.photo.path + '">'
					  + '<img src="' + item.photo.path + '" alt="' + item.title + '"/></a>'
					  + '<div class="photo-title">' + item.title + '</div></div>';
			}
			html += "</div>";

			find(".photo-gallery").html(html);

			this.onResize();
		},

		// called when the page becomes invisible
		onPageHide: function() {
			//find(".contents").html("");
		},

		// go to home page
		"$tap:$ .button.back": function() {
			$.mobile.changePage("#page-home", {transition: "slideup", reverse: true});
		},
	});


	function find(s) {
		return page.find(s);
	}

	var photos = null;

})();

( function(window, $, PhotoSwipe) {

	$(document).ready(function() {
		$('#page-photo').on('pageshow', document, function(e) {
			var currentPage = $(e.target), options = {
				/*getToolbar : function() {
					return '<div class="ps-toolbar-close" style="padding-top: 11px;">Back</div><div class="ps-toolbar-play" style="padding-top:11px;">Play</div><div class="ps-toolbar-previous" style="padding-top: 11px;">Previous</div><div class="ps-toolbar-next" style="padding-top:11px;">Next</div>';
				}*/
			}, photoSwipeInstance = $("#photo_gallery a", e.target).photoSwipe(options, currentPage.attr('id'));

			return true;
		}).on('pagehide', document, function(e) {
			var currentPage = $(e.target), photoSwipeInstance = PhotoSwipe.getInstance(currentPage.attr('id'));
			if ( typeof photoSwipeInstance != "undefined" && photoSwipeInstance != null) {
				PhotoSwipe.detatch(photoSwipeInstance);
			}
			return true;
		});
	});

}(window, window.jQuery, window.Code.PhotoSwipe));