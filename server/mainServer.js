Meteor.startup(function () {
  // code to run on server at startup
  return Meteor.methods({
    removeAllEntries: function () {
      return Recetas.remove({});
    }
  });
});
