var backgrounds = {
  'mountains': {
    image: 'dj1.jpg',
    params: {
      'background-attachment': 'fixed',
      'background-position': '-100px -100px'
    }
  },
  'texture 1': {
    image: 'texture1.jpg'
  },
  'texture 2': {
    image: 'texture2.jpg'
  },
  'dark grey': {
    color: '#333'
  },
  'green': {
    color: '#1B503D'
  },
  'grungy 1': {
    image: 'grungy/01.PNG'
  },
  'grungy 2': {
    image: 'grungy/02.PNG'
  },
  'grungy 3': {
    image: 'grungy/03.PNG'
  },
  'grungy 4': {
    image: 'grungy/04.PNG'
  },
  'grungy 5': {
    image: 'grungy/05.PNG'
  },
  'grungy 6': {
    image: 'grungy/06.PNG'
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
    setBackground($(event.target).attr('data-name'));
  }
});

Session.setDefault('background', 'mountains');

setBackground = function(name) {
  var bg = backgrounds[name];
  if (! bg) return;

  // reset
  $('body')
    .css('background-image', '')
    .css('background-position', '')
    .css('background-attachment', '');
  
  if (bg.image)
    $('body').css('background-image', "url('/images/" + bg.image + "')");
  if (bg.color)
    $('body').css('background-color', bg.color);

  _.each(bg.params, function(value, key) {
    $('body').css(key, value);
  });
  Meteor.users.update(Meteor.userId(), { $set: { wallpaper: name }});
};

Meteor.startup(function() {
  setBackground(Session.get('background'));
  Deps.autorun(function() {
    if (Meteor.user())
      setBackground(Meteor.user().wallpaper);
  });
});