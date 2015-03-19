Template.listView.helpers({

});


Template.listView.events({
  "submit .new-recipe": function (event) {
    // This function is called when the new task form is submitted
    event.preventDefault();
    var text = event.target.text.value;
    new_recipe_ID = Recetas.insert({
      nombre: text,
      referencia: "",
      ingredientes: [],
      proceso: [],
      createdAt: new Date() // current time
    });

    // Clear form
    event.target.text.value = "";
    Session.set("viewRecipe", new_recipe_ID  );
    Session.set("editStep1",true);
    //Session.set("ingredientList", []  );
    //Ingredientes.remove({});
    // Prevent default form submit
    return false;
  }
});


Template.receta.events({
  "click .itemReceta": function(event){
    event.preventDefault();
    var recipe_ID = this._id;
    Session.set("viewRecipe", recipe_ID  );
    Session.set("editAllSteps",true);
    return false;
  },
  "click .delete": function(event){
    event.preventDefault();
    var recipe_ID = this._id;
    Recetas.remove(recipe_ID);
    return false;
  },
  "click .edit": function(event){
    event.preventDefault();
    var recipe_ID = this._id;
    Session.set("viewRecipe", recipe_ID  );
    Session.set("editAllSteps",true);
    return false;
  }


});
