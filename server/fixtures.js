// Meteor.startup(function() {
//   if (Items.find().count() === 0) {
//     Items.insert({
//       body: 'Welcome'
//     });
//   }
// });

Meteor.startup(function() {
  var users = Meteor.users.find();
  users.forEach(function(user) {
    var items = Items.find({ userId: user._id });
    var itemsWithoutRank = Items.find({ userId: user._id, rank: { $exists: false }});
    // console.log(items.count(), itemsWithoutRank.count());
    if (items.count() === itemsWithoutRank.count()) {

      _.each(items.fetch(), function(item, index) {
        console.log('adding rank ' + item._id + ' index ' + index);
        Items.update(item._id, { $set: { rank: index }});
      });
    }
  });
  
  Meteor.users.update({ showColors: { $exists: false }}, { $set: { showColors: false }});
  
  Items.find({ color: { $exists: false }}).forEach(function(doc) {
    Items.update(doc._id, { $set: { color: makeRandomColor() }});
  });
  
  Notes.find({ color: { $exists: false }}).forEach(function(doc) {
    Notes.update(doc._id, { $set: { color: makeRandomColor() }});
  });
});
