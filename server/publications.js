var privateUserFieldsOption = {
  fields: {
    wallpaper: true
  }
};

Meteor.publishAuth = function(name, fn) {
  Meteor.publish(name, function() {
    if (! this.userId)
      return this.ready();
    
    return fn.apply(this, arguments);
  });
};

Meteor.publishAuth('items', function() {
  return Items.find({ userId: this.userId });
});

Meteor.publishAuth('notes', function() {
  return Notes.find({ userId: this.userId });
});

Meteor.publishAuth('user', function() {
  return Meteor.users.find(this.userId, privateUserFieldsOption);
});
