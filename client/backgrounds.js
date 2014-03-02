var backgrounds = {
  'grey': {
    background: '#CCC'
  },
  'mountains': {
    'background-image': 'dj1.jpg',
    'background-attachment': 'fixed',
    'background-position': '-100px -100px'
  },
  'texture 1': {
    'background-image': 'texture1.jpg'
  },
  'texture 2': {
    'background-image': 'texture2.jpg'
  },
  'dark grey': {
    background: '#333'
  },
  'green': {
    background: '#1B503D'
  },
  'grungy 1': {
    'background-image': 'grungy/01.PNG'
  },
  'grungy 2': {
    'background-image': 'grungy/02.PNG'
  },
  'grungy 3': {
    'background-image': 'grungy/03.PNG'
  },
  'grungy 4': {
    'background-image': 'grungy/04.PNG'
  },
  'grungy 5': {
    'background-image': 'grungy/05.PNG'
  },
  'grungy 6': {
    'background-image': 'grungy/06.PNG'
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
      $('body').css('background-image', "url('/images/" + bg.image + "')");

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