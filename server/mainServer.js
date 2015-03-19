Meteor.startup(function () {
  // code to run on server at startup
  return Meteor.methods({
    removeAllEntries: function () {
      return Recetas.remove({});
    }
  });
});


Meteor.methods({
  replaceIngredient: function (recipe_ID, current_values, new_values) {
    // Make sure the user is logged in before inserting a task
//    if (! Meteor.userId()) {
//      throw new Meteor.Error("not-authorized");
//    }
/*
"ID_ingrediente": ingredient_ID,
"nombre": new_name.value,
"tipo": new_tipo.value,
"cantidad": new_qty.value,
"alternativos": new_alternativos.value,

*/
    Recetas.update(
      {_id: recipe_ID,
        "ingredientes.ID_ingrediente": current_values.ID_ingrediente,
        "ingredientes.nombre": current_values.nombre,
        "ingredientes.tipo": current_values.tipo,
        "ingredientes.cantidad": current_values.cantidad,
        "ingredientes.alternativos": current_values.alternativos},
       {$set: {
         "ingredientes.$":  new_values
      } }
    );
  }

/*  deleteTask: function (taskId) {
    Tasks.remove(taskId);
  },
  setChecked: function (taskId, setChecked) {
    Tasks.update(taskId, { $set: { checked: setChecked} });
  }
  */
});
