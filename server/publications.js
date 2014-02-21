Meteor.publish('items', function() {
  if (this.userId)
    return Items.find({ userId: this.userId });
});

Meteor.publish('notes', function() {
  if (this.userId)
    return Notes.find({ userId: this.userId });
});
