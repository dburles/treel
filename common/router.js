Router.configure({
  layoutTemplate: 'layout',
  notFoundTemplate: 'applicationNotFound',
  loadingTemplate: 'applicationLoading'
});

Router.map(function() {
  this.route('home', {
    after: function() {
      if (Meteor.user())
        Router.go('items');
    },
    path: '/'
  });
  this.route('items', {
    path: '/dashboard',
    before: function() {
      this.subscribe('items').wait();
      this.subscribe('notes').wait();
    },
    after: function() {
      if (this.ready() && Meteor.user() && Items.find().count() === 0)
        Meteor.call('onboarding');
    }
  });
});

var requireLogin = function() {
  if (! Meteor.user() && ! Meteor.loggingIn())
    Router.go('home');
};

Router.before(requireLogin, { only: 'items' });