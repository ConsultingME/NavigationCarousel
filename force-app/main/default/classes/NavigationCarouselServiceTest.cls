@isTest 
private class NavigationCarouselServiceTest {

	@isTest(SeeAllData=true)
	private static void getNavigationItems() {
		Navigation_Carousel__c nc = new Navigation_Carousel__c();
		nc.IconSize__c = 'Small';
		nc.Name = 'TestCarousel';
		nc.Page_Size_Large__c = 8;
		nc.Page_Size_Medium__c = 4;
		nc.Page_Size_Small__c = 2;
		insert nc;

		List<Navigation_Carousel_Item__c> items = new List<Navigation_Carousel_Item__c>();
		for (Integer x = 0; x < 9; x++) {
			String xstr = String.valueOf(x);
			Navigation_Carousel_Item__c nci = new Navigation_Carousel_Item__c();
			nci.Id_Parameter__c = xstr;
			nci.Image_Path__c = '/path/' + xstr;
			nci.Label__c = 'Label ' + xstr;
			nci.Name = 'Name ' + xstr;
			nci.Navigation_Carousel__c = nc.Id;
			nci.Parameter__c = xstr;
			nci.RecordTypeId = Schema.SObjectType.Navigation_Carousel_Item__c.getRecordTypeInfosByName().get('Object').getRecordTypeId();
			items.add(nci);
		}
		insert items;

		Test.startTest();
		NavigationCarouselService.NavigationCarousel nctest = NavigationCarouselService.getNavigationItems(nc.Name);
		Test.stopTest();

		System.assertEquals(nc.IconSize__c, nctest.IconSize);
		System.assertEquals(Integer.valueOf(nc.Page_Size_Large__c), nctest.PageSizeLarge);
		System.assertEquals(Integer.valueOf(nc.Page_Size_Medium__c), nctest.PageSizeMedium);
		System.assertEquals(Integer.valueOf(nc.Page_Size_Small__c), nctest.PageSizeSmall);

		System.assertEquals(items.size(), nctest.NavigationCarouselItems.size());

	}
}