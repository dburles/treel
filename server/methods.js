Meteor.methods({
  onboarding: function() {
    if (! this.userId)
      return;
    
    if (Items.find({ userId: this.userId }).count() === 0) {
      var itemId = Items.insert({ userId: this.userId, body: 'Welcome' });
      Notes.insert({
        userId: this.userId,
        itemId: itemId,
        body: "This is a todo item!"
      });
      Notes.insert({
        userId: this.userId,
        itemId: itemId,
        body: "Press the right arrow to create another item"
      });
      Notes.insert({
        userId: this.userId,
        itemId: itemId,
        body: "Press the down arrow to create another list"
      });
    }
  }
});