/**
 * Page - Article
 */

(function() {'use strict';

	var page = app.registerPage('page-article', {

		// show an article
		setArticle: function(item) {
			applyArticle(item);
			currentItem = item;
		},

		// initialize the page
		onPageInit: function() {
			scrollBody = new iScroll(find(".contents")[0], {useTransition: true, vScrollbar: false});
			setInterval(function() {
				refreshBodySize();
			}, 500);
		},

		// the page becomes visible
		onPageShow: function() {
			this.onResize();
			setTextSizeFromSetting();
		},

		// resize all elements according to the screen
		onResize: function() {
			var heightWindow = $(window).height();
			var heightHeader = find(".ui-header").outerHeight();
			var heightFooter = find(".ui-footer").outerHeight();
			find(".ui-content").outerHeight(heightWindow - heightHeader - heightFooter - 45);
			refreshBodySize();
		},

		// Update Button on Sections Popup
		"$tap:#popup-sections .update": function() {
			updateArticles(true);
		},

		// called when the user tap a category on Sections Popup
		onGoCategory: function(name) {
			if (name == "TopNews") {
				if (flagLoading) {
					return;
				}
				currentCategory = "News";
				updateArticles();
				$("#popup-sections").popup("close");
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
				$("#popup-sections .sub-list-container").css("left", 0);
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
		},

		// get current category
		getCurrentCategory: function() {
			return currentCategory;
		},

		// go to home page
		"$tap:$ .button.back": function() {
			$.mobile.changePage("#page-home", {transition: "slideup", reverse: true});
		},

		// show Font-size menu
		"$tap:$ .button.fontsize": function() {
			$("#popup-fontsize").popup('open', {positionTo: find(".button.fontsize")});
		},

		// show Share menu
		"$tap:$ .button.share": function() {
			$("#popup-share").popup('open', {positionTo: find(".button.share")});
		},

		// called on font-size select on Font-size menu
		"$tap:#popup-fontsize li a": function(event, src) {
			var id = src.id;
			setTextSize(id);
		},

		// called when the share menu becomes visible
		"$popupafteropen:#popup-share": function() {
			if (currentItem == null) {
				return;
			}
			{
				var url = 'http://www.facebook.com/sharer.php?u=' + currentItem.link;
				$("#popup-share li a#facebook")[0].href = url;
				$("#popup-share li a#facebook")[0].target = "_blank";
			}
			{
				var url = 'http://www.twitter.com/intent/tweet?text=' + currentItem.link;
				$("#popup-share li a#twitter")[0].href = url;
				$("#popup-share li a#twitter")[0].target = "_blank";
			}
			{
				var url = 'https://plus.google.com/share?url=' + currentItem.link;
				$("#popup-share li a#google")[0].href = url;
				$("#popup-share li a#google")[0].target = "_blank";
			}
			{
				var url = 'http://www.linkedin.com/shareArticle?mini=true&url=' + currentItem.link;
				$("#popup-share li a#linkedin")[0].href = url;
				$("#popup-share li a#linkedin")[0].target = "_blank";
			}
		}
	});

	function find(s) {
		return page.find(s);
	}

	var currentCategory = "News";
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
			ret = "<div class='page type1'>"
					+ "<article id='article" + (index) + "' class='col0 article article0'><div>" + makeArticle("col2_big", items[0]) + "</div></article>"
					+ "<div class='col_split'></div>"
					+ "<div class='col1'>"
						+ "<div class='row row0'>"
							+ "<article id='article" + (index+1) + "' class='article article1'><div>" + makeArticle("simple_bottom", items[1]) + "</div></article>"
                            + "<div class='col_split'></div>"
							+ "<article id='article" + (index+2) + "' class='article article2'><div>" + makeArticle("simple_bottom", items[2]) + "</div></article>"
						+ "</div>"
						+ "<div class='row_split'></div>"
						+ "<div class='row row1'>"
							+ "<article id='article" + (index+3) + "' class='article article3'><div>" + makeArticle("simple_bottom", items[3]) + "</div></article>"
                            + "<div class='col_split'></div>"
							+ "<article id='article" + (index+4) + "' class='article article4'><div>" + makeArticle("simple_bottom", items[4]) + "</div></article>"
						+ "</div>"
					+ "</div>"
				+ "</div>";
		} else if (type == "main") {
			ret = "<div class='page type2'>"
					+ "<article id='article" + (index) + "' class='col0 article article0'><div>" + makeArticle("simple_top", items[0]) + "</div></article>"
					+ "<div class='col_split'></div>"
					+ "<div class='col1'>"
						+ "<div class='row0'>"
							+ "<article id='article" + (index+1) + "' class='article article1'><div>" + makeArticle("simple_bottom", items[1]) + "</div></article>"
							+ "<div class='col_split'></div>"
							+ "<article id='article" + (index+2) + "' class='article article2'><div>" + makeArticle("simple_bottom", items[2]) + "</div></article>"
						+ "</div>"
						+ "<div class='row_split'></div>"
						+ "<article id='article" + (index+3) + "' class='row1 article article3'><div>" + makeArticle("col2_right", items[3]) + "</div></article>"
					+ "</div>"
					+ "<div class='col_split'></div>"
					+ "<article id='article" + (index+4) + "' class='col2 article article4'><div>" + makeArticle("simple_top", items[4]) + "</div></article>"
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
		var vStart = "<div class='article_" + type + "'><div class='titlee'>" + item.title + "</div>";
		var vEnd = "</div><br><br><br><br><br><br>";
		var vContent = "<div class='content'>";
		if (item.author != "") {
			vContent += "<div class='author'>By " + item.author.toUpperCase() + "</div>";
		}
		vContent += "<div class='datee'>" + item.articleDate + "</div>" + item.story + "</div>";
		var vPhoto = "";
		if (item.photo != null) {
			vPhoto= "<center'><img src='" + item.photo.path + "' width='IMAGE-WIDTH'></center>";
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
		var html = "<div id='TopNews'>Top News</div><div id='Photos'>Photos</div><div id='Videos'>Videos</div>"
		var categories = app.data.getSectionCategories();
		for (var i = 0; i < categories.length; i++) {
			var category = categories[i];
			html += "<div id='" + category + "' class='category'>" + category + "</div>";
		}
		list.html(html);
		$("#popup-sections").on("popupafteropen", function() {
			iscrollCategories.refresh();
		});
		$("#popup-sections").on("popupafterclose", function() {
			$("#popup-sections .sub-list-container").css("left", "23rem");
		});

		UiUtil.addTapListener($("#popup-sections .list > div > div"), function() {
			page.onGoCategory(this.id);
		}, 3);

		$("#popup-sections .sub-list-container").on("tap", function() {
			$("#popup-sections .sub-list-container").css("left", "23rem");
		});
	}

	var scrollBody = null;
	var currentItem = null;
	var currentContent = "";

	function refreshBodySize() {
		var heightBody = find(".ui-content").height();
		var heightTitle = find(".header").outerHeight();
		find(".contents").height(heightBody - heightTitle);

		splitArticle();

		if (scrollBody != null) {
			scrollBody.refresh();
		}
	}

	function splitArticle() {
		var content = currentContent;
		var jsection1 = find(".section1");
		var jsection2 = find(".section2");
		var jphoto = find(".photo");
		jsection1.html(content);
		var heightTotal = jsection1.height();
		var heightPhoto = jphoto.height();
		var heightAverage = (heightTotal + heightPhoto * 2) / 3;
		jsection2.html("<BR>");
		var heightLine = jsection2.height();
		jsection2.html("");
		// count to average
		{
			var parent = jsection1[0];
			var other = jsection2[0];
			var indexSplit = -1;
			var children = [];
			for (var i = 0; i < parent.childNodes.length; i++) {
				var child = parent.childNodes[i];
				children.push(child);
			}
			jsection1.html("");
			for (var i = 0; i < children.length; i++) {
				parent.appendChild(children[i]);
				var height = jsection1.height();
				if (height > heightAverage) {
					indexSplit = i + 1;
					break;
				}
			}
			if (indexSplit >= 0) {
				for (var i = indexSplit; i < children.length; i++) {
					other.appendChild(children[i]);
				}
				var rest = jsection1.height() - heightPhoto - jsection2.height();
				if (rest > 0) {
					var lines = "";
					var c = rest * 2 / heightLine;
					for (var i = 0; i < c; i++) {
						lines += "<BR>";
					}
					jsection2.append(lines);
				}
			}
		}
	}

	function applyArticle(item) {
		var ret = "";
		find(".categoryy").html("&nbsp;" + app.getPage("page-home").getCurrentCategory() + "&nbsp;") 
		find(".titlee").html(item.title);
		if (item.photo != null) {
			var img = find(".photo img")[0];
			img.src = item.photo.path;
			img.onload = function() {
				//splitArticle();
			};
			find(".photo .caption").html(item.photo.caption);
		} else {
			var img = find(".photo img")[0];
			img.src = "";
			find(".photo .caption").html("");
		}
		var datePrefix = " ";
		if (item.author != null && item.author != "") {
			find(".author").html("By " + item.author.toUpperCase());
			datePrefix = " | ";
		} else {
			find(".author").html("");
		}
		find(".datee").html(datePrefix + item.articleDate);

		var content = item.story;
		currentContent = content;

		//splitArticle();
	}

	function setTextSizeFromSetting() {
		var size = 10;
		var textSize = app.data.getFontSize();
		setTextSize(textSize);
	}

	function setTextSize(size) {
		var ja = find(".article");
		ja.removeClass("small");
		ja.removeClass("medium");
		ja.removeClass("big");
		ja.removeClass("huge");
		ja.addClass(size);
	}

})();