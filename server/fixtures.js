Meteor.startup(function() {
  if (Items.find().count() === 0) {
    Items.insert({});
  }
});