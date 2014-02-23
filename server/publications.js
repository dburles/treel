var privateUserFieldsOption = {
  fields: {
    wallpaper: true
  }
};

Meteor.publish('items', function() {
  if (this.userId)
    return Items.find({ userId: this.userId });
});

Meteor.publish('notes', function() {
  if (this.userId)
    return Notes.find({ userId: this.userId });
});

Meteor.publish('user', function() {
  if (this.userId)
    return Meteor.users.find(this.userId, privateUserFieldsOption);
});