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
    path: '/notes',
    before: function() {
      this.subscribe('items').wait();
      this.subscribe('notes');
    },
    after: function() {
      if (this.ready() && Meteor.user() && Items.find().count() === 0)
        Items.insert({ body: 'Welcome' });
    }
  });
});

var requireLogin = function() {
  if (! Meteor.user())
    Router.go('home');
};

Router.before(requireLogin, { only: 'items' });