Router.configure({
  layoutTemplate: 'layout',
  notFoundTemplate: 'applicationNotFound',
  loadingTemplate: 'applicationLoading'
});

Router.map(function() {
  this.route('main', {
    path: '/',
    before: function() {
      this.render(this.options.loadingTemplate);
    },
    waitOn: function() {
      return [
        Meteor.subscribe('items'),
        Meteor.subscribe('notes')
      ];
    },
    action: function() {
      if (! this.ready()) return;

      if (Meteor.user())
        this.render('items');
      else
        this.render('home');
    },
    after: function() {
      if (this.ready() && Meteor.user() && Items.find().count() === 0)
        Meteor.call('onboarding');
    }
  });
});
