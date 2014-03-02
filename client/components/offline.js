Template.offline.helpers({
  offline: function() {
    return ! Meteor.connection.status().connected && Router.current().ready();
  }
});