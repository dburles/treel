Items = new Meteor.Collection('items');

Items.helpers({
  notes: function() {
    return Notes.find({ itemId: this._id });
  }
});

Items.allow({
  insert: function(userId, doc) {
    return userId === doc.userId;
  },
  update: function(userId, doc, fields, modifier) {
    return userId === doc.userId;
  },
  remove: function(userId, doc) {
    return userId === doc.userId;
  },
  fetch: ['userId']
});

Items.before.insert(function(userId, doc) {
  doc.userId = userId;
  doc.createdAt = Date.now();
});

Items.before.update(function(userId, doc, fieldNames, modifier, options) {
  modifier.$set.updatedAt = Date.now();
});
