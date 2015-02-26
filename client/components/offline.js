var hasBeenConnected = false;
Template.offline.helpers({
  offline: function() {
    if (! Meteor.status().connected && hasBeenConnected)
      return true;
    else
      hasBeenConnected = true;
  }
});