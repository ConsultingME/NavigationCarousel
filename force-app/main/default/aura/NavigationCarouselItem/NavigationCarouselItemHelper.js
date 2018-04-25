({
	onClick: function (component) {
		var item = component.get("v.item");
		//console.log(item);

        if ($A.util.isEmpty(item.url) === true) {
            var evt = null;
            switch(item.RecordType.Name.toLowerCase()) {
                case 'object':
                    evt = $A.get("e.force:navigateToObjectHome");
                    evt.setParams({
                      "scope": item.Parameter
                    });
                    break;
                case 'home':
                    evt = this.createNavigateToPage('');
                    break;
                case 'page':
                    evt = this.createNavigateToPage(item.Parameter);
                    break;
                case 'topic':
                    evt = this.createNavigateToPage('topic/'+item.IdParameter+'/'+encodeURIComponent(item.Parameter));
                    break;
                default:
                    break;
            }
            evt.fire();
        }
	},

	createNavigateToPage: function(page) {
		var url = "/"+ page;
		var urlEvent = $A.get("e.force:navigateToURL");
		urlEvent.setParams({
		  "url": url
		});
		return urlEvent;
	}
})