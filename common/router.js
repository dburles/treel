Router.configure({
  layoutTemplate: 'layout'
});

Router.map(function() {
  this.route('home', {
    before: function() {
      if (Meteor.user())
        Router.go('items');
    },
    path: '/'
  });
  this.route('items', {
    path: '/notes'
  });
});

var requireLogin = function() {
  if (! Meteor.user())
    Router.go('home');
};

Router.before(requireLogin, { only: 'items' });