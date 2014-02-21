Template.items.helpers({
  items: function() {
    return Items.find();
  },
  email: function() {
    return Meteor.user() && Meteor.user().email();
  }
});

Template.items.events({
  'click .sign-out': function() {
    Meteor.logout();
  }
});

Template.note.events({
  // 'keydown textarea': function(event) {
  //   // disable return
  //   if (event.keyCode === 13)
  //     event.preventDefault();
  // },
  'blur textarea': function(event, template) {
    event.preventDefault();

    var body = template.find('textarea').value;

    if (! body)
      return;

    if (! this.itemId)
      Items.update(this._id, { $set: { body: body }});
    else
      Notes.update(this._id, { $set: { body: body }});

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
    Notes.update(this._id, { $set: { checked: (this.checked ? false : true) }});
  }
});

Template.note.helpers({
  isNote: function() {
    return this.itemId;
  },
  canDelete: function() {
    if (! this.itemId)
      if (this.notes().count() === 0 && Items.find().count() !== 1)
        return true;
    return false;
  },
  formVisible: function() {
    return ! this.body || this._id === Session.get('editing');
  },
  body: function() {
    if (Session.get('editing') === this._id)
      return this.body;
    else
      return this.body && new Handlebars.SafeString(this.body.replace(/\n/g, '<br>'));
  }
});

// Meteor.startup(function() {
//   $('textarea').expanding();
// });

// Template.note.rendered = function() {
//   var textarea = $(this.find('textarea'));
//   if (textarea)
//     textarea.expanding();
// };

Template.item.events({
  'click .go-down': function(event, template) {
    event.preventDefault();
    Items.insert({});
  },
  'click .go-right': function(event, template) {
    event.preventDefault();
    Notes.insert({ itemId: this._id });
  }
});
