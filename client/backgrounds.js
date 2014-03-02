var backgrounds = {
  'grey': {
    background: '#CCC'
  },
  'gum': {
    background: '#3F4158'
  },
  'classy': {
    background: '#3F2121'
  },
  'dark grey': {
    background: '#333'
  },
  'green': {
    background: '#1B503D'
  }
};

Template.items.helpers({
  backgrounds: function() {
    var i = 1;
    return _.map(backgrounds, function(bg, key) {
      bg.count = i;
      bg.name = key;
      i += 1;
      return bg;
    });
  }
});

Template.items.events({
  'click .set-wp': function(event, template) {
    event.preventDefault();
    Session.set('newItemId', '');
    var name = $(event.target).attr('data-name');
    Meteor.users.update(Meteor.userId(), { $set: { wallpaper: name }});
  }
});

Session.setDefault('background', 'grey');

setBackground = function(name) {
  var bg = backgrounds[name];
  if (! bg) return;

  $('body')
    .css('background', '')
    .css('background-image', '')
    .css('background-position', '')
    .css('background-attachment', '')
    .css('background-color', '');

  _.each(bg, function(value, key) {
    if (key === 'background-image')
      $('body').css('background-image', "url('/images/" + value + "')");
    else
      $('body').css(key, value);
  });
};

Meteor.startup(function() {
  setBackground(Session.get('background'));
  Deps.autorun(function() {
    if (Meteor.user())
      setBackground(Meteor.user().wallpaper);
  });
});