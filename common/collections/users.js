Meteor.users.helpers({
  email: function() {
    return this.emails[0].address;
  }
});