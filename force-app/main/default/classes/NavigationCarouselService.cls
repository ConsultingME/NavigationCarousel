public class NavigationCarouselService { 

	@AuraEnabled
	public static NavigationCarousel getNavigationItems(string carouselName) {
		NavigationCarousel result;

		System.debug(carouselName);
		List<Navigation_Carousel__c> items = [select IconSize__c, Page_Size_Large__c, Page_Size_Medium__c, Page_Size_Small__c, (select RecordType.Name, Id_Parameter__c, Image_Path__c, Label__c, Parameter__c from Navigation_Carousel_Items__r) from Navigation_Carousel__c where Name = :carouselName];
		System.debug(items);

		if (0 < items.size()) {
			result = new NavigationCarousel(items[0]);
		}

		Map<Id, ConnectApi.Topic> topics = GetTopicsMap();
        system.debug(topics);
		for (NavigationCarouselItem nci : result.NavigationCarouselItems) {
			if (nci.RecordType.Name.toLowerCase() == 'topic') {
				nci.Label = topics.get(nci.IdParameter).Name;
			}
		}
		return result;
	}
    
	public static Map<Id, ConnectApi.Topic> GetTopicsMap() {
		Map<Id, ConnectApi.Topic> topicMap = new Map<Id, ConnectApi.Topic>();
		List<ConnectApi.Topic> topics = GetTopics();
		for (ConnectApi.Topic t : topics) {
			topicMap.put(t.Id, t);
		}
		return topicMap;
	}

	@AuraEnabled
	public static List<ConnectApi.Topic> GetTopics() {
		ConnectApi.TopicPage topicList = ConnectApi.Topics.getTopics(Network.getNetworkId(), 0, 100, ConnectApi.TopicSort.alphaAsc);
		return topicList.topics;
	}
    
	public class NavigationCarouselItem {
		@AuraEnabled public Id Id {get;set;}
		@AuraEnabled public string IdParameter {get;set;}
		@AuraEnabled public string ImagePath {get;set;}
		@AuraEnabled public string Label {get;set;}
		@AuraEnabled public string Parameter {get;set;}
		@AuraEnabled public RecordType RecordType {get;set;}

		public NavigationCarouselItem(Navigation_Carousel_Item__c data) {
			Id = data.Id;
			IdParameter = data.Id_Parameter__c;
			ImagePath = data.Image_Path__c;
			Label = data.Label__c;
			Parameter = data.Parameter__c;
			RecordType = data.RecordType;
		}
	}

	public class NavigationCarousel {
		@AuraEnabled public Id Id {get;set;}
		@AuraEnabled public List<NavigationCarouselItem> NavigationCarouselItems {get; set;}
		@AuraEnabled public Integer PageSizeSmall {get;set;}
		@AuraEnabled public Integer PageSizeMedium {get;set;}
		@AuraEnabled public Integer PageSizeLarge {get;set;}
        @AuraEnabled public String IconSize {get;set;}

		public NavigationCarousel() {
			NavigationCarouselItems = new List<NavigationCarouselItem>();
		}

		public NavigationCarousel(Navigation_Carousel__c data) {
			Id = data.Id;
			PageSizeSmall = Integer.valueOf(data.Page_Size_Small__c);
			PageSizeMedium = Integer.valueOf(data.Page_Size_Medium__c);
			PageSizeLarge = Integer.valueOf(data.Page_Size_Large__c);
            IconSize = String.valueOf(data.IconSize__c);

			NavigationCarouselItems = new List<NavigationCarouselItem>();
			for(Navigation_Carousel_Item__c nci : data.Navigation_Carousel_Items__r) {
				NavigationCarouselItems.add(new NavigationCarouselItem(nci));
			}
		}
	}
}