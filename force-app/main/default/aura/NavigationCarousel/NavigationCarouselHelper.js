({
	init: function (component, event, helper) {
		//console.log('NavigationCarouselHelper.init');
		var items = [];
		var pages = [];
		var baseUrl = component.get("v.baseUrl");

		var carouselName = component.get("v.carouselName");
		//console.log(carouselName);
		var action = component.get("c.getNavigationItems");
		action.setParams({"carouselName" : carouselName}); 

		//var sldsname = component.get("v.sldsResourceName");
		//console.log(sldsname);
		//var sldspath = $A.get('$Resource.' + sldsname);
		//console.log(sldspath);
		//component.set("v.sldsResourcePath", sldspath);

		//$A.createComponent("aura:html", {"tag": "link", HTMLAttributes: { "href": sldspath+'assets/styles/salesforce-lightning-design-system-ltng.css', "rel": "stylesheet", "type": "text/css"}}, 
		//	function(cmp, status) { 
				//console.log("in css create callback");
				//console.log(status);
				//console.log(cmp);
		//		var body = component.get("v.body");
		//		body.push(cmp);
		//		component.set("v.body", body);
		//	}
		//);

		//$A.createComponent("ltng:require", {styles: ['/resource/SLDS102/assets/styles/salesforce-lightning-design-system-ltng.css']}, null);
		//$A.get('$Resource.SLDS102'+'assets/styles/salesforce-lightning-design-system-ltng.css', null);

		action.setCallback(this, function(actionResult) {
			var data = actionResult.getReturnValue();
			//console.log(data);

			if (null != data) {
                if ($A.util.isEmpty(baseUrl) === false) {
                    data.NavigationCarouselItems.map(function(m) {
                        //console.log(m);
                        var url = '';
                        m.ImagePath = m.ImagePath;
    
                        // Poteet: removed to allow the use of the standard LDS Icon component
                        //m.ImagePath = sldspath + m.ImagePath;
    
                        switch(m.RecordType.Name.toLowerCase()) {
                            case 'object':
                                //throw;
                                break;
                            case 'home':
                                url = baseUrl;
                                break;
                            case 'page':
                                url = baseUrl + m.Parameter;
                                break;
                            case 'topic':
                                url = baseUrl + 'topic/'+m.IdParameter+'/'+encodeURIComponent(m.Parameter);
                                break;
                            default:
                                break;
                        }
                        m.url = url;
                    });
                }

				var formFactor = $A.get("$Browser.formFactor");
				//console.log(formFactor);
				var pageSize = data.PageSizeLarge;
				switch (formFactor) {
					case "PHONE" :
						pageSize = data.PageSizeSmall;
						break;
					case "TABLET" :
						pageSize = data.PageSizeMedium;
						break;
					default:
						break;
				}

				component.set("v.pageSize", pageSize);
				var x = 0;
				while(x < data.NavigationCarouselItems.length) {
					var page = {};
					//console.log(page);
					page.items = data.NavigationCarouselItems.slice(x, x + pageSize);
					page.selected = false;
					//console.log(page);
					pages.push(page);
					x += pageSize
				}

				component.set("v.items", data.NavigationCarouselItems);
				component.set("v.pages", pages);

				this.navigateToPage(component, 0);
			}
		});
		$A.enqueueAction(action);
	},

	navigateToPage: function(component, page) {
		//console.log('navigateToPAge');
		var pages = component.get("v.pages");
		if (pages 
				&& pages.length > 0
				&& page >= 0
				&& page < pages.length
			) {
			var currentPage = pages[page];

			for(var q = 0; q < pages.length; q++) {
				//console.log('q='+q+' page='+page);
				if (q === page) {
					//console.log('page selected');
					pages[q].selected = true;
				} else {
					//console.log('page not selected');
					pages[q].selected = false;
				}
			}
			//console.log(pages);
			component.set("v.currentPage", currentPage);
			component.set("v.currentPageIndex", page);
			component.set("v.pages", pages);

			//var prevButton = component.find("prevButton");
			//prevButton.set("v.disabled", page == 0 ? true : false);
			//page === 0 ? $A.util.addClass(prevButton, 'disabled') : $A.util.removeClass(prevButton, 'disabled')
			//var nextButton = component.find("nextButton");
			//nextButton.set("v.disabled", page == pages.length-1 ? true : false);
			//page === pages.length-1 ? $A.util.addClass(nextButton, 'disabled') : $A.util.removeClass(nextButton, 'disabled')
		}
	},

	movePages: function(component, interval) {
		var currentPageIndex = component.get("v.currentPageIndex");
		var newPage = currentPageIndex + interval;
		//console.log(newPage);
		this.navigateToPage(component, newPage);
	},
		
	prevPage: function(component) {
		this.movePages(component, -1);
	},

	nextPage: function(component) {
		this.movePages(component, 1);
	},

	attachTouchEvents: function(component, event, helper) {
		if (component.isValid()) { 
			var hitme = component.find("navCar");
			//console.log(hitme);
			//debugger;
			var mc = new Hammer(hitme.getElement());
			mc.on("swipeleft", function(ev) {
				helper.nextPage(component);
			});
			mc.on("swiperight", function(ev) {
				helper.prevPage(component);
			});
		}
	}

})