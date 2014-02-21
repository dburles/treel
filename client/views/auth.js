Template.auth.events({
  'submit .sign-in': function(event, template) {
    event.preventDefault();
    var email = $('.sign-in input[name="email"]').val();
    var password = $('.sign-in input[name="password"]').val();
    Meteor.loginWithPassword(email, password, function(error) {
      if (error)
        showError(error.message);
    });
  },
  'submit .sign-up': function(event, template) {
    event.preventDefault();
    var email = $('.sign-up input[name="email"]').val();
    var password = $('.sign-up input[name="password"]').val();
    var passwordConfirm = $('.sign-up input[name="password_confirm"]').val();

    if (password !== passwordConfirm)
      return showError('Password does not match confirmation password');

    try {
      Accounts.createUser({
        email: email,
        password: password
      }, function(error) {
        if (error)
          return showError(error.message);

        Meteor.loginWithPassword(email, password);

        _.defer(function() {
          showAlert('Welcome ' + email + ' thanks for signing up!');
          Router.go('items');
        });
      });
    } catch(error) {
      return showError(error.message);
    }
  }
});