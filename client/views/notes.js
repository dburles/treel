SimpleRationalRanks = {
  beforeFirst: function (firstRank) { return firstRank - 1; },
  between: function (beforeRank, afterRank) { return (beforeRank + afterRank) / 2; },
  afterLast: function (lastRank) { return lastRank + 1; }
};

Template.items.helpers({
  items: function() {
    return Items.find({}, { sort: { rank: 1 }});
  },
  email: function() {
    return Meteor.user() && Meteor.user().email();
  }
});

Template.items.rendered = function() {
  $('table tbody').sortable({
    handle: 'i.move',
    stop: function (event, ui) {
      var newRank;
      var el = ui.item.get(0), before = ui.item.prev().get(0), after = ui.item.next().get(0);

      if (! before) { // moving to the top of the list
        newRank = SimpleRationalRanks.beforeFirst(UI.getElementData(after).rank);

      } else if (! after) { // moving to the bottom of the list
        newRank = SimpleRationalRanks.afterLast(UI.getElementData(before).rank);

      } else {
        newRank = SimpleRationalRanks.between(
          UI.getElementData(before).rank,
          UI.getElementData(after).rank);
      }

      Items.update(UI.getElementData(el)._id, {$set: {rank: newRank}}, handleMethodError);
    }
  });
};

Template.items.events({
  'click .sign-out': function() {
    Meteor.logout();
  }
});

Template.note.events({
  'keydown textarea': function(event, template) {
    Session.set('editing', this._id);
  },
  // 'keydown textarea': function(event) {
  //   // disable return
  //   if (event.keyCode === 13)
  //     event.preventDefault();
  // },
  'blur textarea': function(event, template) {
    event.preventDefault();
    if (! Session.get('editing')) return;

    var body = template.find('textarea').value;

    if (! body)
      return;

    if (! this.itemId)
      Items.update(this._id, { $set: { body: body }}, handleMethodError);
    else
      Notes.update(this._id, { $set: { body: body }}, handleMethodError);

    Session.set('editing', false);
  },
  'click .delete': function(event, template) {
    var self = this;
    // if (! confirm("Are you sure?"))
    //   return;

    if (! self.itemId) {
      if (self.notes().count() === 0)
        Items.remove(self._id);
    } else {
      Notes.remove(self._id);
    }
  },
  'click .edit': function(event, template) {
    Session.set('editing', this._id);
  },
  'click .check': function(event, template) {
    Notes.update(this._id, { $set: { checked: (this.checked ? false : true) }}, handleMethodError);
  }
});

Template.note.helpers({
  controlColor: function() {
    // XXX this kinda like breaks a lot of the available options
    // with the background API, but we're not using them at the moment
    var user = Meteor.user();
    return user && user.wallpaper && backgrounds[user.wallpaper].background;
  },
  isNote: function() {
    return this.itemId;
  },
  canDelete: function() {
    if (! this.itemId && (this.notes().count() > 0 || Items.find().count() === 1))
      return false;

    return true;
  },
  canCheck: function() {
    return !!this.body;
  },
  isEditing: function() {
    return Session.equals('editing', this._id);
  }
});

Template.itemControls.events({
  // XXX how can we get the data from the previous item in the each loop
  // using a data attribute feels shit
  'click .go-up': function(event, template) {
    event.preventDefault();

    var el = $(template.firstNode).parent();
    var before = $(el.prev()).attr('data-rank');
    var after = $(el.next()).attr('data-rank');
    var newRank;

    if (! before)
      newRank = SimpleRationalRanks.beforeFirst(this.rank);
    else
      newRank = SimpleRationalRanks.between(this.rank, parseFloat(before));
    
    var insertId = Items.insert({ rank: newRank }, handleMethodError);
    if (insertId) Session.set('newItemId', insertId);
  },
  'click .go-down': function(event, template) {
    event.preventDefault();
    
    var el = $(template.firstNode).parent();
    var before = $(el.prev()).attr('data-rank');
    var after = $(el.next()).attr('data-rank');
    var newRank;

    if (! after)
      newRank = SimpleRationalRanks.afterLast(this.rank);
    else
      newRank = SimpleRationalRanks.between(this.rank, parseFloat(after));
    
    var insertId = Items.insert({ rank: newRank }, handleMethodError);
    if (insertId) Session.set('newItemId', insertId);
  },
  'click .go-right': function(event, template) {
    event.preventDefault();

    var insertId = Notes.insert({ itemId: this._id }, handleMethodError);
    if (insertId) Session.set('newItemId', insertId);
  }
});

Template.textarea.rendered = function() {
  var elem = $(this.find('textarea'));
  elem.expanding();

  if (Session.get('newItemId') === this.data._id)
    elem.focus();
};
