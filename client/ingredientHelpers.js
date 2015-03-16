
Template.UnIngrediente.events({
  "click .item": function(event) {
    Session.set("editIngredient", this.index);
    return false;
  },

  "click .edit_ing_button": function(event){
    event.preventDefault();
    Session.set("editIngredient", this.index);
    return false;
  },

  "click .confirm_ing_button": function(event){
    event.preventDefault();
    var new_qty =  document.getElementById('ing_editor_qty_'+this.index);
    var new_name =  document.getElementById('ing_editor_name_'+this.index);
    var new_tipo =  document.getElementById('ing_editor_units_'+this.index);
    var new_alternativos =  document.getElementById('ing_editor_alt_'+this.index);
    var ingredient_ID = Ingredientes.findOne({"nombre": new_name.value});
    if (! ingredient_ID) {
      ingredient_ID = Ingredientes.insert({
        "nombre": new_name.value,
        createdAt: new Date()
      });
    }
    var current_values = this.value;
    var new_values = {
      "ID_ingrediente": ingredient_ID,
      "nombre": new_name.value,
      "tipo": new_tipo.value,
      "cantidad": new_qty.value,
      "alternativos": new_alternativos.value,
      createdAt: new Date()
      };
    var recipe_ID = Session.get("viewRecipe");
    new_ingredientes = Recetas.findOne(recipe_ID).ingredientes;
    new_ingredientes[this.index]=new_values;
    Recetas.update(recipe_ID,
       {$set: {
         ingredientes:  new_ingredientes
       }});
// DOES NOT WORK!?!?
//    Meteor.call ("replaceIngredient", recipe_ID, current_values,new_values);
    //Clean up
    new_qty.value=""; new_name.value=""; new_tipo.value=""; new_alternativos.value="";
    Session.set("editIngredient", null);
    return false;
  },

  "click .cancel_ing_button": function(event){
    event.preventDefault();
    //Clean up
  //  new_qty.value=""; new_name.value=""; new_tipo.value=""; new_alternativos.value="";
    Session.set("editIngredient", null);
    return false;
  },

  "click .delete": function(event) {
    recipe_ID = Session.get("viewRecipe");
    Recetas.update(recipe_ID,
    {$pull: {ingredientes:
      {alternativos: this.value.alternativos,
        cantidad: this.value.cantidad,
        nombre: this.value.nombre,
        tipo: this.value.tipo
      }}});
  }
});

Template.UnIngrediente.helpers({
  Placeholder: function(field, alttext) {
    return !field ? alttext : field;
  },
  Format: function(field) {
    return !field ? {class: "italic"} : {class: ""};
  }
});
