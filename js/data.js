/**
 * Article downloading management
 */

var DataCenter = null;

(function() {'use strict';

	DataCenter = function() {
		var self = this;
		self.initialize();
	};

	DataCenter.prototype = {
		id: "dataCenter",

		// initialize the data center
		initialize: function() {
			var self = this;
		},
		
		// get data from the cache and server,  return true if data comes from cache\
		// - success(data)
		// - fail(message)
		get: function(name, success, fail, flagUpdate) {
			var self = this;
			if (flagUpdate == true) {
				return self.load(name, success, fail);
			}
			return getData(self, name, success, fail);
		},
		// load data from the server
		// - success(data)
		// - fail(message)
		load: function(name, success, fail) {
			var self = this;
			loadData(self, name, success, fail);
		},
		// photo gallery
		getPhotos: function() {
			return getPhotos();
		},
		// video gallery
		getVideos: function(name) {
			return getVideos(name);
		},
		// get available sections
		getSections: function() {
			var ret = [];
			for (var i = 0; i < sections.length; i++) {
				if (this.isSectionVisible(sections[i])) {
					ret.push(sections[i]);
				}
			}
			return ret;
		},
		// get all sections
		getAllSections: function() {
			return sections;
		},
		// get section categories
		getSectionCategories: function() {
			var ret = [];
			for (var name in xmlFeed.categories) {
				ret.push(name);
			}
			return ret;
		},
		// get sections in category
		getSectionsInCategory: function(category) {
			var ret = [];
			var arr = xmlFeed.categories[category];
			for (var i = 0; i < arr.length; i++) {
				if (this.isSectionVisible(arr[i].name)) {
					ret.push(arr[i].name);
				}
			}
			return ret;
		},

		// section visibility
		isSectionVisible: function(name) {
			if (sources[name] != null && sources[name].visible == true) {
				return true;
			} else {
				return false;
			}
		},
		setSectionVisible: function(name, value) {
			if (sources[name] != null) {
				sources[name].visible = value;
				saveSettings();
			}
		},
		// section title
		getSectionTitle: function(name) {
			if (sources[name] != null) {
				var title = sources[name].title;
				if (title != null) {
					return title;
				}
			}
			return name;
		},
		// expiry seconds
		getExpirySeconds: function() {
			return xmlFeed.expirySeconds;
		},
		setExpirySeconds: function(seconds) {
			xmlFeed.expirySeconds = seconds;
			saveSettings();
		},
		// font size
		getFontSize: function() {
			return xmlFeed.fontSize;
		},
		setFontSize: function(value) {
			xmlFeed.fontSize = value;
			saveSettings();
		}
	};

	var xmlFeed = {

		fontSize: "small",
		expirySeconds: 60,

		categories: {
			"<i class='fa fa-navicon (alias)'></i> News" : [{ 
				name : '<i class="fa fa-navicon (alias)"></i> News', 
				url : 'http://dfihluw6z4ymo.cloudfront.net/0/xml/news.xml',
				//url : 'news.xml',
				visible : true
			}, {
				name : '<i class="fa fa-university"></i> Politics',
				url : 'http://dfihluw6z4ymo.cloudfront.net/0/xml/politics.xml',
				visible : true
			}, {
				name : '<i class="fa fa-paw"></i> Africa',
				url : 'http://dfihluw6z4ymo.cloudfront.net/0/xml/africa.xml',
				visible : true
			}, {
				name : '<i class="fa fa-globe"></i> World',
				url : 'http://dfihluw6z4ymo.cloudfront.net/0/xml/world.xml',
				visible : true
			}],
			"<i class='fa fa-suitcase'></i> Business" : [{
				name : '<i class="fa fa-suitcase"></i> Business',
				url : 'http://dfihluw6z4ymo.cloudfront.net/0/xml/business.xml',
				visible : true
			}, {
				name : '<i class="fa fa-suitcase"></i> Corporates',
				url : 'http://dfihluw6z4ymo.cloudfront.net/0/xml/corporates.xml',
				visible : true
			}, {
				name : '<i class="fa fa-suitcase"></i> Enterprise',
				url : 'http://dfihluw6z4ymo.cloudfront.net/0/xml/enterprise.xml',
				visible : true
			}, {
				name : '<i class="fa fa-suitcase"></i> Markets',
				url : 'http://dfihluw6z4ymo.cloudfront.net/0/xml/markets.xml',
				visible : true
			}, {
				name : '<i class="fa fa-suitcase"></i> Tech',
				url : 'http://dfihluw6z4ymo.cloudfront.net/0/xml/technology.xml',
				visible : true
			}],
			"<i class='fa fa-plane'></i> Countries" : [{
				name : '<i class="fa fa-globe"></i> Countries',
				url : 'http://dfihluw6z4ymo.cloudfront.net/0/xml/counties.xml',
				visible : true
			}, {
				name : '<i class="fa fa-globe"></i> Nairobi',
				url : 'http://dfihluw6z4ymo.cloudfront.net/0/xml/nairobi.xml',
				visible : true
			}, {
				name : '<i class="fa fa-globe"></i> Mombasa',
				url : 'http://dfihluw6z4ymo.cloudfront.net/0/xml/mombasa.xml',
				visible : true
			}, {
				name : '<i class="fa fa-globe"></i> Kisumu',
				url : 'http://dfihluw6z4ymo.cloudfront.net/0/xml/kisumu.xml',
				visible : true
			}, {
				name : '<i class="fa fa-globe"></i> Nakuru',
				url : 'http://dfihluw6z4ymo.cloudfront.net/0/xml/nakuru.xml',
				visible : true
			}, {
				name : '<i class="fa fa-globe"></i> Eldoret',
				url : 'http://dfihluw6z4ymo.cloudfront.net/0/xml/eldoret.xml',
				visible : true
			}, {
				name : '<i class="fa fa-globe"></i> Nyeri',
				url : 'http://dfihluw6z4ymo.cloudfront.net/0/xml/nyeri.xml',
				visible : true
			}],
			"<i class='fa fa-life-ring'></i> Sports" : [{
				name : '<i class="fa fa-trophy"></i> Sports',
				url : 'http://dfihluw6z4ymo.cloudfront.net/0/xml/sports.xml',
				visible : true
			}, {
				name : '<i class="fa fa-trophy"></i> Football',
				url : 'http://dfihluw6z4ymo.cloudfront.net/0/xml/football.xml',
				visible : true
			}, {
				name : '<i class="fa fa-trophy"></i> Athletics',
				url : 'http://dfihluw6z4ymo.cloudfront.net/0/xml/athletics.xml',
				visible : true
			}, {
				name : '<i class="fa fa-trophy"></i> Rugby',
				url : 'http://dfihluw6z4ymo.cloudfront.net/0/xml/rugby.xml',
				visible : true
			}, {
				name : '<i class="fa fa-trophy"></i> Golf',
				url : 'http://dfihluw6z4ymo.cloudfront.net/0/xml/golf.xml',
				visible : true
			}, {
				name : '<i class="fa fa-trophy"></i> Others',
				url : 'http://dfihluw6z4ymo.cloudfront.net/0/xml/othersports.xml',
				visible : true
			}, {
				name : '<i class="fa fa-trophy"></i> Talkup',
				url : 'http://dfihluw6z4ymo.cloudfront.net/0/xml/talkup.xml',
				visible : true
			}],
			"<i class='fa fa-legal (alias)'></i> Opinion" : [{
				name : '<i class="fa fa-thumbs-up"></i> Blogs',
				url : 'http://dfihluw6z4ymo.cloudfront.net/0/xml/blogs.xml',
				visible : true
			}, {
				name : '<i class="fa fa-thumbs-up"></i> Commentaries',
				url : 'http://dfihluw6z4ymo.cloudfront.net/0/xml/commentaries.xml',
				visible : true
			}, {
				name : '<i class="fa fa-thumbs-up"></i> Editorials',
				url : 'http://dfihluw6z4ymo.cloudfront.net/0/xml/editorials.xml',
				visible : true
			}],
			"<i class='fa fa-heart'></i> Life&Style" : [{
				name : '<i class="fa fa-empire"></i> ArtCulture',
				title: '<i class="fa fa-empire"></i> Art & Culture',
				url : 'http://dfihluw6z4ymo.cloudfront.net/0/xml/artsculture.xml',
				visible : true
			}, {
				name : '<i class="fa fa-group (alias)"></i> Family',
				url : 'http://dfihluw6z4ymo.cloudfront.net/0/xml/family.xml',
				visible : true
			}, {
				name : '<i class="fa fa-medkit"></i> Health',
				url : 'http://dfihluw6z4ymo.cloudfront.net/0/xml/healthscience.xml',
				visible : true
			}, {
				name : '<i class="fa  fa-play-circle"></i> Showbiz',
				url : 'http://dfihluw6z4ymo.cloudfront.net/0/xml/showbiz.xml',
				visible : true
			}, {
				name : '<i class="fa fa-truck"></i> Travel',
				url : 'http://dfihluw6z4ymo.cloudfront.net/0/xml/travel.xml',
				visible : true
			}]
		}
	};
	var youtubeURL = "http://gdata.youtube.com/feeds/users/NTVKenya/uploads?alt=json-in-script&format=5";

	// load section settings
	{
		var saved = localStorage["sections"];
		if (saved != null) {
			xmlFeed = JSON.parse(saved);
		}
	}
	function saveSettings() {
		localStorage["sections"] = JSON.stringify(xmlFeed);
	}

	var sources = {};
	var sections = [];
	// initialize source mapping
	{
		for (var category in xmlFeed.categories) {
			var arrFeed = xmlFeed.categories[category];
			for (var i = 0; i < arrFeed.length; i++) {
				var feed = arrFeed[i];
				sources[feed.name] = feed;
				sections.push(feed.name);
			}
		}
	}

	// get data from cache, or from server if the data is not exist in cache
	function getData(self, name, success, fail) {
		var cache = loadCacheArticles(name);
		if (cache != null) {
			var seconds = (new Date().getTime() - new Date(cache.updatedTime).getTime()) / 1000;
			if (xmlFeed.expirySeconds == 0 || seconds < xmlFeed.expirySeconds) {
				if (success != null) {
					success(cache);
				}
				return true;
			} else {
				console.log("Expired " + seconds + " - " + name);
			}
		}
		loadData(self, name, success, fail);
	}
	
	// load data from server and cache them
	function loadData(self, name, success, fail) {
		if (name == "youtube") {
			loadYoutube(self, success, fail);
			return;
		}
		var section = sources[name];
		if (section == null) {
			if (fail != null) {
				fail("The URL for '" + name + "' does not exist.");
			}
			return;
		}
		console.log("Downloading - " + name);
		Util.ajax({
			url: section.url,
			//responseType: "xml",
			success: function(str) {
				console.log("Loaded Category - " + name);
				str = str.replace(/& /g, "&amp; ");
				var xml = Util.parseXML(str);
				var data = parseData(xml);
				saveCacheArticles(name, data);
				if (success != null) {
					success(data);
				}
			},
			fail: function(req) {
				console.log("Load data failed - status: " + req.status + "(" + req.statusText + ") response:" + req.responseText);
				if (fail != null) {
					fail("Loading Data failed");
				}
			}
		});
	}
	
	// parse the server articles xml
	function parseData(xml) {
		var data = {};
		data.updatedTime = (new Date()).toISOString();
		data.items = [];
		var items = $(xml).find("item");
		for (var i = 0; i < items.length; i++) {
			var itemSrc = $(items[i]);
			var itemDst = {};
			itemDst.title = itemSrc.find("title").text().trim();
			itemDst.language = itemSrc.find("language").text().trim();
			itemDst.description = itemSrc.find("description").text().trim();
			itemDst.articleDate = itemSrc.find("articleDate").text().trim();
			itemDst.story = itemSrc.find("story").text().trim();
			itemDst.author = itemSrc.find("author").text().trim();
			itemDst.link = itemSrc.find("link").text().trim();
			itemDst.photo = null;
			var jphoto = itemSrc.find("photo");
			if (jphoto.length > 0) {
				itemDst.photo = {
					path: jphoto.text().replace(/\+/gi, '%2B'),
					caption: itemSrc.find("caption").text().trim()
				};
			}
			itemDst.video = null;
			var jvideo = itemSrc.find("video");
			if (jvideo.length > 0) {
				itemDst.video = {
					path: jvideo.text().replace(/\+/gi, '%2B'),
					caption: itemSrc.find("caption").text().trim()
				};
			}
			data.items.push(itemDst);
		}
		return data;
	}

	// load data from youtube and cache them
	function loadYoutube(self, success, fail) {
		console.log("Downloading from Youtube");
		Util.ajax({
			url: youtubeURL,
			success: function(str) {
				console.log("Loaded from Youtube");
				try {
					var func = new Function("gdata", str);
					func(gdata);
				} catch (e) {
					console.log("Exception during loading from youtube - " + e);
					if (fail != null) {
						fail("Exception loading Youtube");
					}
				}
			},
			fail: function(req) {
				console.log("Load youtube failed - status: " + req.status + "(" + req.statusText + ") response:" + req.responseText);
				if (fail != null) {
					fail("Loading Youtube failed");
				}
			}
		});

		var gdata = {
			io: {
				handleScriptLoaded: function(src) {
					var data = {};
					data.updatedTime = (new Date()).toISOString();
					data.items = [];
					var items = src.feed.entry;
					for (var i = 0; i < items.length; i++) {
						var itemSrc = items[i];
						var itemDst = {};
						itemDst.category = itemSrc.category[1].term;
						itemDst.title = itemSrc.title.$t;
						itemDst.language = "";
						itemDst.description = itemSrc.media$group.media$description.$t;
						itemDst.articleDate = itemSrc.published.$t;
						itemDst.story = "";
						itemDst.author = itemSrc.author[0].name.$t;
						itemDst.link = itemSrc.link[0].href;
						itemDst.photo = null;
						var url = itemDst.link;
						if (url.indexOf("feature=") >= 0) {
							url = url.substring(0, url.indexOf("feature=") - 1);
						}
						if (url.indexOf("watch?") >= 0 && url.indexOf("v=") >= 0) {
							url = url.substring(0, url.indexOf("watch?")) + "embed/" + url.substring(url.indexOf("v=") + 2, url.length);
						}
						itemDst.video = {
							path: url,
							caption: itemDst.title,
							thumbnail: itemSrc.media$group.media$thumbnail[1].url.replace(/\+/gi, '%2B')
						};
						data.items.push(itemDst);
					}

					saveCacheArticles("youtube", data);
					if (success != null) {
						success(data);
					}
				}
			}
		}
	}

	// local storage cache
	var memCache = {};
	function loadCacheArticles(name) {
		var data = memCache[name];
		if (data != null) {
			return data;
		}
		var str = localStorage["articles_" + name];
		if (str == null) {
			return null;
		}
		data = JSON.parse(str);
		memCache[name] = data;
		return data;
	}
	function saveCacheArticles(name, data) {
		memCache[name] = data;
		localStorage["articles_" + name] = JSON.stringify(data);
	}

	// photo gallery
	function getPhotos() {
		var map = {};
		var list = [];
		for (var i = 0; i < sections.length; i++) {
			var data = loadCacheArticles(sections[i]);
			if (data != null) {
				var items = data.items;
				for (var j = 0; j < items.length; j++) {
					var item = items[j];
					if (item.photo != null) {
						if (map[item.photo.path] == null) {
							list.push(item);
							map[item.photo.path] = item;
						}
					}
				}
			}
		}
		return list;
	}

	// video gallery
	function getVideos(name) {
		var map = {};
		var list = [];
		var data = loadCacheArticles(name);
		if (data != null) {
			var items = data.items;
			for (var j = 0; j < items.length; j++) {
				var item = items[j];
				if (item.video != null) {
					if (map[item.video.path] == null) {
						list.push(item);
						map[item.video.path] = item;
					}
				}
			}
		}
		return list;
	}
})();
