Template.item.events({
  'submit form': function(event, template) {
    event.preventDefault();

    var body = template.find('input[type="text"]').value;

    if (! body)
      return;

    Notes.insert({
      itemId: this._id,
      body: body
    });
  }
});

Template.items.helpers({
  items: function() {
    return Items.find();
  }
});