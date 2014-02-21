Template.alert.events({
  'click .alert': function() {
    Session.set('alert', false);
  }
});

Template.alert.helpers({
  alert: function() {
    return Session.get('alert');
  }
});

var timeout;
showAlert = function(message) {
  Session.set('alert', message);
  Meteor.clearTimeout(timeout);
  timeout = Meteor.setTimeout(function() {
    Session.set('alert', false);
  }, 4000);
};
