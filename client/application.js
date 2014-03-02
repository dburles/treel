Meteor.subscribe('user');

handleMethodError = function(error) {
  showError("Oh no, there was an error storing your changes! " + error.message);
};