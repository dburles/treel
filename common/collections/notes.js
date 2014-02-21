Notes = new Meteor.Collection('notes');

Notes.allow({
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

Notes.before.insert(function(userId, doc) {
  doc.userId = userId;
  doc.createdAt = Date.now();
});

Notes.before.update(function(userId, doc, fieldNames, modifier, options) {
  modifier.$set.updatedAt = Date.now();
});