Items = new Meteor.Collection('items');

Items.helpers({
  notes: function() {
    return Notes.find({ itemId: this._id });
  }
});