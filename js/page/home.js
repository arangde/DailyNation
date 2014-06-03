/**
 * Page - Home
 */

(function() {'use strict';

	var page = app.registerPage('page-home', {

		// initialize page
		onPageInit: function() {
			var self = this;
			updateDateTimeOnHeader(null);
			setTimeout(function() {
				updateArticles();
			}, 500);
		},

		// the page becomes visible
		onPageShow: function() {
			addSections();
			this.onResize();
		},

		// resize all elements according to window
		onResize: function() {
			var heightWindow = $(window).height();
			var heightHeader = find(".ui-header").outerHeight();
			var heightFooter = find(".ui-footer").outerHeight();
			var height = heightWindow - heightHeader - heightFooter - 70;
			find(".ui-content").outerHeight(height + 1);
			var heightContent = find(".ui-content").height() - 1;
			find(".articles").css("height", heightContent);
			find(".ui-content").css("font-size", ((heightContent-30) / 100) + "px");
			if (pager != null) {
				var width = find(".articles").width();
				var height = find(".articles").height();
				pager.resize({
					width: width,
					height: height - 30
				});
			}
		},

		// Update Button on Sections Popup
		"$tap:#popup-sections .update": function() {
			updateArticles(true);
		},

		// called when the user tap an article
		onGoArticle: function(index) {
			if (articles[index] != null) {
				$.mobile.changePage( "#page-article", { transition: "slideup"} );
				app.getPage("page-article").setArticle(articles[index]);
			}
		},

		// called when the user tap a category on Sections Popup
		onGoCategory: function(name) {
			if (name == "TopNews") {
				if (flagLoading) {
					return;
				}
				currentCategory = '<i class="fa fa-navicon (alias)"></i> News';
				updateArticles();
				$("#popup-sections").popup("close");
				$.mobile.changePage("#page-home"); 
			} else if (name == "Photos") {
				if (flagLoading) {
					return;
				}
				$.mobile.changePage("#page-photo", { transition: "slideup"});
				$("#popup-sections").popup("close");
			} else if (name == "Videos") {
				if (flagLoading) {
					return;
				}
				$.mobile.changePage("#page-video", { transition: "slideup"});
				$("#popup-sections").popup("close");
			} else {
				var html = ""
				var sections = app.data.getSectionsInCategory(name);
				for (var i = 0; i < sections.length; i++) {
					var section = sections[i];
					html += "<div id='" + section + "' class='section'>" + app.data.getSectionTitle(section) + "</div>";
				}
				$("#popup-sections .category-title").html(name);
				$("#popup-sections .sub-list > div").html(html);
				$("#popup-sections .sub-list-container").show();
				$("#popup-sections .sub-list-container").css("left", "14rem");

				iscrollSections.refresh();
				UiUtil.addTapListener($("#popup-sections .sub-list > div > div"), function() {
					page.onGoSection(this.id);
				}, 3);
			}
		},

		// called when the user tap a section on Sections Popup
		onGoSection: function(name) {
			if (flagLoading) {
				return;
			}
			currentCategory = name;
			updateArticles();
			$("#popup-sections").popup("close");
			$.mobile.changePage("#page-home");
		},

		// get current category
		getCurrentCategory: function() {
			return currentCategory;
		}
	});

	function find(s) {
		return page.find(s);
	}

	var currentCategory = '<i class="fa fa-fax"></i> News';
	var pager = null;
	var flagLoading = false;
	var articles = [];

	function updateDateTimeOnHeader(date) {
		if (date == null) {
			find(".ui-header .time .value").html("");
			find(".ui-header .date").html("");
			return;
		}
		var strTime = date.toTimeString();
		find(".ui-header .time .value").html(strTime);
		var strDate = date.toDateString();
		find(".ui-header .date").html(strDate);
	}

	function updateArticles(flagUpdate) {
		flagLoading = true;
		$.mobile.showPageLoadingMsg();
		app.data.get(currentCategory, function(data) {
			$.mobile.hidePageLoadingMsg();
			flagLoading = false;
			// update the time first
			updateDateTimeOnHeader(new Date(data.updatedTime));
			// make the articles content
			setArticleContent(data);
		}, function(msg) {
			$.mobile.hidePageLoadingMsg();
			flagLoading = false;
			// failed
			console.log("Article Load Fail: " + msg);
		}, flagUpdate);
	}

	function setArticleContent(data) {
		var items = data.items;
		articles = items;
		// compute page count
		var pageCount = Math.floor(items.length / 5);
		if (items.length % 5 > 0) {
			pageCount++;
		}
		// make the content
		var width = find(".articles").width();
		var height = find(".articles").height();
		var html = "<div class='pager'>";
		for (var i = 0; i < pageCount; i++) {
			var type = "main";
			if (i == 0) {
				type = "home";
			}
			html += makeArticlePage(type, [items[i*5], items[i*5+1], items[i*5+2], items[i*5+3], items[i*5+4]], i*5);
		}
		html += "</div>";
		find(".articles").html(html);

		find(".articles .article_simple_bottom").each(function() {

			if($(this).find(".article_photo").length > 0) {
				var article_h = $(this).parents("article").height();
				var article_w = $(this).width();
				var title_h = $(this).find(".title").height() + 5;
				var content_h = $(this).find(".content").height() + 15;
				var photo_h = article_h - title_h - content_h;

				$(this).height(photo_h);

				var photo = $(this).find(".article_photo img");
				photo.height(photo_h);
				photo.css("width", "auto");
				/*
				photo.onload = function() {
					console.log(photo);
					var photo_r = photo.clientHeight / photo.clientWidth;
					console.log(photo.height);
					console.log(photo.width);
					console.log(photo_r);
					if(photo_h > article_w * photo_r) {
						$(this).height(article_w * photo_r);
						$(this).css("width", "auto");
					}
					else {
						$(this).css("height", "auto");
						$(this).width(article_w);
					}
				};
				*/

				
			}
		});

		pager = find(".articles > div.pager").fotorama({
			width: width,
			height: height - 30,
			click: false,
			arrows: false
		}).data("fotorama");

	}

	function makeArticlePage(type, items, index) {
		var ret = "";
		if (type == "home") {
			console.log(items[0]);
			ret = "<div class='page type1'>"
					+ "<article id='article" + (index) + "' class='col0 article preview article0'><div>" + makeArticle("col2_big", items[0]) + "</div></article>"
					+ "<div class='col_split'></div>"
					+ "<div class='col1'>"
						+ "<div class='row row0'>"
							+ "<article id='article" + (index+1) + "' class='article preview article1'><div>" + makeArticle("simple_bottom", items[1]) + "</div></article>"
                            + "<div class='col_split'></div>"
							+ "<article id='article" + (index+2) + "' class='article preview article2'><div>" + makeArticle("simple_bottom", items[2]) + "</div></article>"
						+ "</div>"
						+ "<div class='row_split'></div>"
						+ "<div class='row row1'>"
							+ "<article id='article" + (index+3) + "' class='article preview article3'><div>" + makeArticle("simple_bottom", items[3]) + "</div></article>"
                            + "<div class='col_split'></div>"
							+ "<article id='article" + (index+4) + "' class='article preview article4'><div>" + makeArticle("simple_bottom", items[4]) + "</div></article>"
						+ "</div>"
					+ "</div>"
				+ "</div>";
		} else if (type == "main") {
			ret = "<div class='page type2'>"
					+ "<article id='article" + (index) + "' class='col0 article preview article0'><div>" + makeArticle("simple_top", items[0]) + "</div></article>"
					+ "<div class='col_split'></div>"
					+ "<div class='col1'>"
						+ "<div class='row0'>"
							+ "<article id='article" + (index+1) + "' class='article preview article1'><div>" + makeArticle("simple_bottom", items[1]) + "</div></article>"
							+ "<div class='col_split'></div>"
							+ "<article id='article" + (index+2) + "' class='article preview article2'><div>" + makeArticle("simple_bottom", items[2]) + "</div></article>"
						+ "</div>"
						+ "<div class='row_split'></div>"
						+ "<article id='article" + (index+3) + "' class='row1 article preview article3'><div>" + makeArticle("col2_right", items[3]) + "</div></article>"
					+ "</div>"
					+ "<div class='col_split'></div>"
					+ "<article id='article" + (index+4) + "' class='col2 article preview article4'><div>" + makeArticle("simple_top", items[4]) + "</div></article>"
				+ "</div>";
		}
		ret = ret.replace(/<article /g, "<article onmousedown='onArticleMouseDown.call(this, event)' ontouchstart='onArticleTouchStart.call(this, event)' ");
		return ret;
	}
	function makeArticle(type, item) {
		if (item == null) {
			return "";
		}
		var ret = "";
		var vStart = "<div class='article_" + type + "'><div class='title'>" + item.title + "</div>";
		var vEnd = "</div>";
		var vContent = "<div class='content'><div class='desc'>";
		if (item.author != "") {
			vContent += "<span class='author'>By " + item.author.toUpperCase() + ", </span>";
		}
		vContent += "<span class='date'>" + item.articleDate + "</span></div>" + item.description + "</div>";
		var vPhoto = "";
		if (item.photo != null) {
			vPhoto= "<div class='article_photo'><img src='" + item.photo.path + "' width='IMAGE-WIDTH'></div>";
		}
		if (type == "col2_big") {
			vPhoto = vPhoto.replace("IMAGE-WIDTH", "90%");
			ret = vStart + vPhoto + vContent + vEnd;
		} else if (type == "simple_bottom") {
			vPhoto = vPhoto.replace("IMAGE-WIDTH", "90%");
			ret = vStart + vContent + vPhoto + vEnd;
		} else if (type == "simple_top") {
			vPhoto = vPhoto.replace("IMAGE-WIDTH", "90%");
			ret = vStart + vPhoto + vContent + vEnd;
		} else if (type == "col2_right") {
			vPhoto = vPhoto.replace("IMAGE-WIDTH", "50%");
			vPhoto = vPhoto.replace("img ", "img style='float:right' ");
			ret = vStart + vPhoto + vContent + vEnd;
		}
		return ret;
	}

	var iscrollCategories = new iScroll($("#popup-sections .list")[0], {useTransition: true, hScrollbar:false, vScrollbar: false});
	var iscrollSections = new iScroll($("#popup-sections .sub-list")[0], {useTransition: true, hScrollbar:false, vScrollbar: false});
	function addSections() {
		var list = $("#popup-sections .list > div");
		var html = "<div id='TopNews'><i class='fa fa-rss-square'></i> Top News</div><div id='Photos'><i class='fa fa-photo (alias)'></i> Photos</div><div id='Videos'><i class='fa fa-video-camera'></i> Videos</div>"
		var categories = app.data.getSectionCategories();
		for (var i = 0; i < categories.length; i++) {
			var category = categories[i];
			html += '<div id="' + category + '" class="category">' + category
				 + '<div class="popup-indicator"></div>'
				 + '</div>';
		}
		list.html(html);
		$("#popup-sections").on("popupafteropen", function() {
			iscrollCategories.refresh();
		});
		$("#popup-sections").on("popupafterclose", function() {
			$("#popup-sections .sub-list-container").css("left", "15rem");
			$("#popup-sections .sub-list-container").hide();
			$("#popup-sections .popup-indicator").hide();
		});

		UiUtil.addTapListener($("#popup-sections .list > div > div"), function() {
			page.onGoCategory(this.id);

			$("#popup-sections .popup-indicator").hide();
			$(this).find(".popup-indicator").show();
		}, 3);

		$("#popup-sections .sub-list-container").on("tap", function() {
			$("#popup-sections .sub-list-container").css("left", "15rem");
			$("#popup-sections .sub-list-container").hide();
			$("#popup-sections .popup-indicator").hide();
		});
	}

	/*
		Article Touch Controller
	*/
	function processTap(self) {
		if (self.data_tap) {
			var index = parseInt(self.id.substring(7));
			page.onGoArticle(index);
		}
	}

	function processTouch(self, event) {
		var dx = event.clientX - self.data_start_x;
		var dy = event.clientY - self.data_start_y;
		if (dx * dx + dy * dy > 10) {
			self.data_tap = false;
		}
		return;
		var newScrollY = self.data_scroll_y - dy;
		if (newScrollY < 0) {
			newScrollY = 0;
		}
		var max = self.childNodes[0].offsetHeight;
		if (newScrollY > max) {
			newScrollY = max;
		}
		self.scrollTop = newScrollY;
	}

	window.onArticleMouseDown = function(event) {
		var self = this;
		self.data_tap = true;
		self.data_scroll_y = self.scrollTop;
		self.data_start_x = event.clientX;
		self.data_start_y = event.clientY;
		var onMove = function(event) {
			processTouch(self, event);
		}
		var onUp = function(event) {
			window.removeEventListener("mousemove", onMove);
			window.removeEventListener("mouseup", onUp);
			processTap(self);
		}
		window.addEventListener("mousemove", onMove);
		window.addEventListener("mouseup", onUp);
	}

	window.onArticleTouchStart = function(event) {
		var self = this;
		self.data_tap = true;
		self.data_scroll_y = self.scrollTop;
		self.data_start_x = event.changedTouches[0].clientX;
		self.data_start_y = event.changedTouches[0].clientY;
		var onMove = function(event) {
			processTouch(self, event.changedTouches[0]);
		}
		var onUp = function(event) {
			window.removeEventListener("touchmove", onMove);
			window.removeEventListener("touchend", onUp);
			window.removeEventListener("touchcancel", onUp);
			processTap(self);
		}
		window.addEventListener("touchmove", onMove);
		window.addEventListener("touchend", onUp);
		window.addEventListener("touchcancel", onUp);
	}

})();

// Circular Content Rotator

jQuery(document).ready(function($) {
	var circular = $('#page-home .circularContent');
	var circularSingle = $('#page-home .circularContent .article');
	var arrows = $('#page-home .ui-bbar .arrows');
	var leftArrow = $('#page-home .ui-bbar .arrows .left-arrow');
	var rightArrow = $('#page-home .ui-bbar .arrows .right-arrow');
	rightArrow.click(function(event) {
		circularSingle.fadeOut();
	});
});
