({
	doInit: function (component, event, helper) {
		helper.init(component, event, helper);
	},

	prev: function(component, event, helper) {
		helper.prevPage(component);
	},

	next: function(component, event, helper) {
		helper.nextPage(component);
	},

	goToPage: function(component, event, helper) {
		helper.navigateToPage(component, Number(event.currentTarget.dataset.index));
	},

	attachTouchEvents: function(component, event, helper) {
		if (component.isValid()) { 
			helper.attachTouchEvents(component, event, helper);
		}
	}
})