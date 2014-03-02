Items = new Meteor.Collection('items');

Items.helpers({
  notes: function() {
    return Notes.find({ itemId: this._id });
  },
  rankedBefore: function() {
    var items = Items.find({ rank: { $lt: this.rank }}, { sort: { rank: 1 }});
    return items.count() > 0 && items.fetch()[0];
  },
  rankedAfter: function() {
    var items = Items.find({ rank: { $gt: this.rank }}, { sort: { rank: 1 }});
    return items.count() > 0 && items.fetch()[0];
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
  // var rankItem = Items.findOne({ userId: Meteor.userId() }, { sort: { rank: -1 }});
  // doc.rank = rankItem && (rankItem.rank + 1) || 0;
});

Items.before.update(function(userId, doc, fieldNames, modifier, options) {
  modifier.$set.updatedAt = Date.now();
});
