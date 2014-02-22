Router.configure({
  layoutTemplate: 'layout',
  notFoundTemplate: 'applicationNotFound',
  loadingTemplate: 'applicationLoading'
});

Router.map(function() {
  this.route('home', {
    before: function() {
      if (Meteor.user())
        Router.go('items');
    },
    path: '/auth'
  });
  this.route('items', {
    path: '/',
    before: function() {
      this.subscribe('items').wait();
      this.subscribe('notes').wait();
    },
    after: function() {
      if (this.ready() && Meteor.user() && Items.find().count() === 0)
        Meteor.call('onboarding');
    }
  });
  this.route('applicationLoading', { path: '/test' });
});

var requireLogin = function() {
  if (! Meteor.user())
    Router.go('home');
};

Router.before(requireLogin, { only: 'items' });