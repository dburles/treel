Router.configure({
  layoutTemplate: 'layout',
  notFoundTemplate: 'applicationNotFound',
  loadingTemplate: 'applicationLoading'
});

Router.route('/', {
  waitOn: function() {
    return [
      Meteor.subscribe('items'),
      Meteor.subscribe('notes')
    ];
  },
  action: function() {
    if (! this.ready() || Meteor.loggingIn())
      return;

    if (Meteor.user())
      this.render('items');
    else
      this.render('home');
  },
  onAfterAction: function() {
    if (this.ready() && Meteor.user() && Items.find().count() === 0)
      Meteor.call('onboarding');
  }
});
