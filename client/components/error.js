Template.error.events({
  'click .alert': function() {
    Session.set('error', false);
  }
});

Template.error.helpers({
  error: function() {
    return Session.get('error');
  }
});

var timeout;
showError = function(message) {
  Session.set('error', message);
  Meteor.clearTimeout(timeout);
  timeout = Meteor.setTimeout(function() {
    Session.set('error', false);
  }, 4000);
};