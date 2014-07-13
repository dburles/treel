Meteor.users.helpers({
  email: function() {
    return this.emails[0].address;
  }
});

Meteor.users.allow({
  update: function (userId, doc, fields, modifier) {
    if (doc._id !== userId)
      return false;

    if (_.contains(fields, 'wallpaper') || _.contains(fields, 'showColors'))
      return true;
  }
});
