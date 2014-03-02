SimpleRationalRanks = {
  beforeFirst: function (firstRank) { return parseFloat(firstRank) - 1; },
  between: function (beforeRank, afterRank) { return (parseFloat(beforeRank) + parseFloat(afterRank)) / 2; },
  afterLast: function (lastRank) { return parseFloat(lastRank) + 1; }
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
        newRank = SimpleRationalRanks.beforeFirst(
          $(after).attr('data-rank'));

      } else if (! after) { // moving to the bottom of the list
        newRank = SimpleRationalRanks.afterLast(
          $(before).attr('data-rank'));

      } else {
        newRank = SimpleRationalRanks.between(
          $(before).attr('data-rank'),
          $(after).attr('data-rank'));
      }

      Items.update($(el).attr('data-id'), {$set: {rank: newRank}}, handleMethodError);
    }
  }).disableSelection();
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
  isNote: function() {
    return this.itemId;
  },
  canDelete: function() {
    if (! this.itemId) {
      if (this.notes().count() > 0)
        return false;
      if (Items.find().count() === 1)
        return false;
    }
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
  'click .go-up': function(event, template) {
    event.preventDefault();
    
    var before = this.rankedBefore();
    var after = this.rankedAfter();
    var newRank;

    if (! before)
      newRank = SimpleRationalRanks.beforeFirst(this.rank);
    else if (! after)
      newRank = SimpleRationalRanks.between(this.rank, before.rank);
    else
      newRank = SimpleRationalRanks.between(this.rank, before.rank);
    
    var insertId = Items.insert({ rank: newRank }, handleMethodError);
    if (insertId) Session.set('newItemId', insertId);
  },
  'click .go-down': function(event, template) {
    event.preventDefault();
    
    var before = this.rankedBefore();
    var after = this.rankedAfter();
    var newRank;

    if (! before)
      newRank = SimpleRationalRanks.between(this.rank, after.rank);
    else if (! after)
      newRank = SimpleRationalRanks.afterLast(this.rank);
    else
      newRank = SimpleRationalRanks.between(before.rank, after.rank);
    
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
