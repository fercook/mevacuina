
function max_steps(process_list){
  var max_step = 0;
  process_list.forEach( function(step){
    if (step.orden>max_step) { max_step = step.orden }
  });
  return max_step;
}


Template.UnPaso.events({
  "click .edit_step_button": function(event){
    event.preventDefault();
    Session.set("editStep", this.index);
    return false;
  },
  "click .cancel_step_button": function(event){
    event.preventDefault();
    Session.set("editStep", null);
    Session.set("editStepIngredient", null);
    return false;
  },
  "click .add_step_ingredient": function(event){
    event.preventDefault();
    var nombre = document.getElementById('step_ing_nombre');
    console.log(nombre);
    var ingredient_ID = Ingredientes.findOne({"nombre": nombre.value});
    if (! ingredient_ID) {
      ingredient_ID = Ingredientes.insert({
        "nombre": nombre.value,
        createdAt: new Date()
      });
    }
    var recipe_ID = Session.get("viewRecipe");
    var proceso =  Recetas.findOne(recipe_ID).proceso;
    // I think this.index is the index for the step
    proceso[this.index].ingredientes.push( {
      "ID_ingrediente": ingredient_ID,
      "nombre": nombre.value,
      "cantidad": "",
      createdAt: new Date()
    });
    Recetas.update(recipe_ID,
       {$set: {
         proceso: proceso
         }});
    nombre.value="";
    return false;
  },

  "click .confirm_step_button": function(event){
    event.preventDefault();
    var new_accion =  document.getElementById('step_editor_accion_'+this.index);
    var new_como =  document.getElementById('step_editor_como_'+this.index);
    var new_utensilios =  document.getElementById('step_editor_utensilios_'+this.index);
    var new_tiempo =  document.getElementById('step_editor_tiempo_'+this.index);
    var new_order =  document.getElementById('paso_orden_'+this.index);
    console.log(new_order);
    process_ID = Procedimientos.findOne({"nombre": new_accion.value});
    if (! process_ID) {
      process_ID = Procedimientos.insert({
        "nombre": new_accion.value,
        createdAt: new Date()
      });
    }
    var recipe_ID = Session.get("viewRecipe");
    var new_process = Recetas.findOne(recipe_ID).proceso;
    var new_ingredientes = new_process.ingredientes;
    var max_step = max_steps(new_process);
    new_process[this.index] =       {
            "ID_proceso": process_ID,
            "accion": new_accion.value,
            "orden": +new_order.options[new_order.selectedIndex].value,
            "como": new_como.value,
            "utensilios": new_utensilios.value,
            "tiempo": new_tiempo.value,
            "condicion": "",
            "ingredientes": new_ingredientes,
            createdAt: new Date()
          };
    Recetas.update(recipe_ID,
    {$set: {
      proceso:  new_process
    }});
    new_accion.value="";
    Session.set("editStep",null);
    Session.set("editStepIngredient", null);

    return false;
  },
  "click .delete": function(event){
    var recipe_ID = Session.get("viewRecipe");
    var proceso = Recetas.findOne(recipe_ID).proceso;
    new_proceso= new_proceso.splice(this.index,1);
      Recetas.update(recipe_ID,
         {$set: {
           proceso:  new_proceso
         }});
    }
});


Template.UnPaso.helpers({
  Placeholder: function(field, alttext) {
    return !field ? alttext : field;
  },
  Format: function(field) {
    return !field ? {class: "italic"} : {class: ""};
  },
  Selected: function(step){
    var element = +Session.get("editStep");
    recipe_ID = Session.get("viewRecipe");
    var order = Recetas.findOne(recipe_ID).proceso[element].orden;
    return step==order ? {selected: "selected"} : {};
  },
  step_numbers_as_list: function() {
    recipe_ID = Session.get("viewRecipe");
    var proceso = Recetas.findOne(recipe_ID).proceso;
    var max_step = max_steps(proceso);
    var text = [];
    for (n=1;n<=max_step+1;n++) {
      text.push(n);
    }
    return text;
  }

});





Template.UnStepIngredient.events({
  "click .item": function(event) {
    event.preventDefault();
    Session.set("editStepIngredient", this.index);
    return false;
  },

  "click .edit_step_ingredient_button": function(event){
    event.preventDefault();
    Session.set("editStepIngredient", this.index);
    return false;
  },

  "click .confirm_step_ing_button": function(event){
    event.preventDefault();
    var new_qty =  document.getElementById('step_ing_editor_qty_'+this.index);
    var new_name =  document.getElementById('step_ing_editor_name_'+this.index);
    var ingredient_ID = Ingredientes.findOne({"nombre": new_name.value});
    if (! ingredient_ID) {
      ingredient_ID = Ingredientes.insert({
        "nombre": new_name.value,
        createdAt: new Date()
      });
    }
    var current_values = this.value;
    var recipe_ID = Session.get("viewRecipe");
    var proceso = Recetas.findOne(recipe_ID).proceso;
    // How to obtain the current step being edited???
    proceso[Template.parentData(1).index].ingredientes[this.index]={
      "ID_ingrediente": ingredient_ID,
      "nombre": new_name.value,
      "cantidad": new_qty.value,
      createdAt: new Date()
      };
    Recetas.update(recipe_ID,
       {$set: {
         proceso:  proceso
       }});
// DOES NOT WORK!?!?
//    Meteor.call ("replaceIngredient", recipe_ID, current_values,new_values);
    //Clean up
    new_qty.value=""; new_name.value="";
    Session.set("editStepIngredient", null);
    return false;
  },

  "click .cancel_step_ing_button": function(event){
    event.preventDefault();
    //Clean up
  //  new_qty.value=""; new_name.value=""; new_tipo.value=""; new_alternativos.value="";
    Session.set("editStepIngredient", null);
    return false;
  },

  "click .remove_step_ingredient_button": function(event) {
    var recipe_ID = Session.get("viewRecipe");
    var new_ingredientes = Recetas.findOne(recipe_ID).proceso.ingredientes;
    new_ingredientes= new_ingredientes.splice(this.index,1);
    Recetas.update(recipe_ID,
       {$set: {
         ingredientes:  new_ingredientes
       }});
  }
});


Template.UnStepIngredient.helpers({
  Placeholder: function(field, alttext) {
    return !field ? alttext : field;
  },
  Format: function(field) {
    return !field ? {class: "italic"} : {class: ""};
  }
});
