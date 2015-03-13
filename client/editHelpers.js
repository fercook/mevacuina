
Template.editField.helpers({
   printField: function(obj, fieldname) {
     return obj[fieldname];
    }
  });

Template.editField.events({
  "click .edit_field_button": function(event){
    event.preventDefault();
    console.log(this);
    Session.set("editField", this.fieldDescriptor);
    return false;
  },
  "click .confirm_field_button": function(event){
    event.preventDefault();
    var new_value =  document.getElementById('field_editor_'+this.fieldDescriptor);
    var new_obj = {};
    new_obj[this.fieldDescriptor]=new_value.value;
    Recetas.update(this.receta._id, {$set: new_obj });
    Session.set("editField", null);
    return false;
  },
  "click .cancel_field_button": function(event){
    event.preventDefault();
    Session.set("editField", null);
    return false;
  }
});


  Template.editView.rendered = function () {
    AutoCompletion.init("input#paso_accion");
    AutoCompletion.init("input#paso_nom_ingrediente");
    AutoCompletion.init("input#ing_nombre");
  }


Template.editView.events({
  "click .selectable": function(event){
    event.preventDefault();
    console.log(this);
    return false;
  },

  'keyup input': function(e) {
    // Would be nice if enter moves focus to next input box
    if (e.keyCode === 13) {
      //console.log($(e.target).next('input'));
    }
  },

  'keyup input#ing_nombre': function () {
    AutoCompletion.autocomplete({
      element: 'input#ing_nombre',      // DOM identifier for the element
      collection: Ingredientes,         // MeteorJS collection object
      field: 'nombre',                    // Document field name to search for
      limit: 0,                         // Max number of elements to show
      sort: { name: 1 }});              // Sort object to filter results with
      //filter: { 'gender': 'female' }}); // Additional filtering
    },

  'keyup input#paso_accion': function () {
    AutoCompletion.autocomplete({
      element: 'input#paso_accion',      // DOM identifier for the element
      collection: Procedimientos,         // MeteorJS collection object
      field: 'nombre',                    // Document field name to search for
      limit: 0,                         // Max number of elements to show
      sort: { name: 1 }});              // Sort object to filter results with
      //filter: { 'gender': 'female' }}); // Additional filtering
    },

  'keyup input#paso_nom_ingrediente': function () {
    AutoCompletion.autocomplete({
      element: 'input#paso_nom_ingrediente',      // DOM identifier for the element
      collection: Ingredientes,         // MeteorJS collection object
      field: 'nombre',                    // Document field name to search for
      limit: 0,                         // Max number of elements to show
      sort: { name: 1 }});              // Sort object to filter results with
      //filter: { 'gender': 'female' }}); // Additional filtering
    },

  "click .back": function(event) {
    event.preventDefault();
    Session.set("editStep", false);
    Session.set("viewRecipe", null);
    Session.set("temp_ingredients", [])
    return false;
  },


  "click .continueAll": function(event) {
    event.preventDefault();
    collectGeneralData();
    Session.set("editStep3", false);
    Session.set("editAllSteps",false);
    Session.set("viewRecipe", null);
    Session.set("temp_ingredients", [])
    return false;
  },

  "click .cancel": function(event){
    event.preventDefault();
    Session.set("editStep1", false);
    Session.set("editStep2", false);
    Session.set("editStep3", false);
    Session.set("editAllSteps",false);
    Session.set("viewRecipe", null);
    Session.set("temp_ingredients", [])
    return false;
  },

  "click .add_ingredient": function(event) { ////ACA HERE TODO
    var nombre = document.getElementById('ing_nombre');
    ingredient_ID = Ingredientes.findOne({"nombre": nombre.value});
    if (! ingredient_ID) {
      ingredient_ID = Ingredientes.insert({
        "nombre": nombre.value,
        createdAt: new Date()
      });
    }
    recipe_ID = Session.get("viewRecipe");
    Recetas.update(recipe_ID,
       {$push: {
         ingredientes:  {
           "ID_ingrediente": ingredient_ID,
           "nombre": nombre.value,
           "tipo": "",
           "cantidad": "",
           "alternativos": "",
           createdAt: new Date()
           }
         }});
    nombre.value="";
    return false;
  }
});


Template.UnIngrediente.events({
  "click .item": function(event) {
    Session.set("editField", this.index);
    return false;
  },

  "click .edit_field_button": function(event){
    event.preventDefault();
    Session.set("editField", this.index);
    return false;
  },

  "click .confirm_field_button": function(event){
    event.preventDefault();
    var new_qty =  document.getElementById('ing_editor_qty_'+this.index);
    var new_name =  document.getElementById('ing_editor_name_'+this.index);
    var new_tipo =  document.getElementById('ing_editor_units_'+this.index);
    var new_alternativos =  document.getElementById('ing_editor_alt_'+this.index);
    var ingredient_ID = Ingredientes.findOne({"nombre": new_name.value});
    console.log("EDITANDO");
    console.log(ingredient_ID);
    console.log("A ver");
    if (! ingredient_ID) {
      ingredient_ID = Ingredientes.insert({
        "nombre": new_name.value,
        createdAt: new Date()
      });
    }
    console.log(ingredient_ID);
    console.log("Por fin");
    var new_values = {
      "ID_ingrediente": ingredient_ID,
      "nombre": new_name.value,
      "tipo": new_tipo.value,
      "cantidad": new_qty.value,
      "alternativos": new_alternativos.value,
      createdAt: new Date()
      };
    var recipe_ID = Session.get("viewRecipe");
    var current_values = this.value;
    console.log(recipe_ID);
    console.log(current_values);
    console.log(new_values);
    console.log("Passing over to method");
    Meteor.call ("replaceIngredient", recipe_ID, current_values,new_values);
    //Clean up
    new_qty.value=""; new_name.value=""; new_tipo.value=""; new_alternativos.value="";
    Session.set("editField", null);
    return false;
  },

  "click .cancel_field_button": function(event){
    event.preventDefault();
    //Clean up
  //  new_qty.value=""; new_name.value=""; new_tipo.value=""; new_alternativos.value="";
    Session.set("editField", null);
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

Template.Paso.helpers(
{
  num_steps: function() {
    recipe_ID = Session.get("viewRecipe");
    var proceso = Recetas.findOne(recipe_ID).proceso;
    console.log("PROCESO:");
    console.log(proceso);
    var max_step = 0;
    proceso.forEach( function(step){
      console.log("Adentro del loop ");
      console.log(step);
      if (step.orden>max_step) {
        max_step = step.orden }
      }
    );
    var text = [];
    for (n=1;n<=max_step+1;n++) {
      text.push(n);
    }
    return text;
  },
  newstep_ingredientes: function() {
    var temporal_ingredients = Session.get("temp_ingredients");
    if (!temporal_ingredients) {
      temporal_ingredients = [];
      Session.set("temp_ingredients",[]);
    }
    return temporal_ingredients;
  }
  }
);

Template.Paso.events({
  "click .add_step_ingredient": function(event) {
    var cantidad = document.getElementById('paso_cant_ingrediente');
    var nombre = document.getElementById('paso_nom_ingrediente');
    ingredient_ID = Ingredientes.findOne({"nombre": nombre.value});
    if (! ingredient_ID) {
      ingredient_ID = Ingredientes.insert({
        "nombre": nombre.value,
        createdAt: new Date()
      });
    }
    var temporal_ingredients = Session.get("temp_ingredients");
    if (!temporal_ingredients) {
      temporal_ingredients = [];
    }
    temporal_ingredients.push({"cantidad": cantidad.value, "nombre": nombre.value});
    Session.set("temp_ingredients", temporal_ingredients)
    cantidad.value="";  nombre.value="";
    return false;
  },

  "click .add_step": function(event) {
    //Get all fields
    var orden = document.getElementById("paso_orden");
    var accion = document.getElementById("paso_accion");
    var como = document.getElementById("paso_como");
    var utensilios = document.getElementById("paso_utensilios");
    var tiempo = document.getElementById("paso_tiempo");
    var condicion = document.getElementById("paso_condicion");
    process_ID = Procedimientos.findOne({"nombre": accion.value});
    if (! process_ID) {
      process_ID = Procedimientos.insert({
        "nombre": accion.value,
        createdAt: new Date()
      });
    }
    var temporal_ingredients = Session.get("temp_ingredients");
    if (!temporal_ingredients) {
      temporal_ingredients = [];
    }
    //Insert into Mongo
    recipe_ID = Session.get("viewRecipe");
    Recetas.update(recipe_ID,
    {$push: {
      proceso:  {
        "ID_proceso": process_ID,
        "accion": accion.value,
        "orden": +orden.value,
        "como": como.value,
        "utensilios": utensilios.value,
        "tiempo": tiempo.value,
        "condicion": condicion.value,
        "ingredientes": temporal_ingredients,
        createdAt: new Date()
      }
    }});
    //Clean up
    Session.set("temp_ingredients", [])
    orden.value="";  accion.value="";
    como.value=""; utensilios.value="";
    tiempo.value="";condicion.value="";
    conector.value="";
    return false;
  }

})



//$.fn.editable.defaults.mode = 'inline';
/*
Template.editable.helpers({
  Anything: function(something) {
    console.log(something);
    return something? "false" : "true";
  }
});

Template.editable.rendered = function(){
   $('#editName.editable').editable({
     placement: "auto top",
     success: function(response, newValue) {
       console.log('set new value to ' + newValue);

       recipe_ID = Session.get("viewRecipe");

       Recetas.update(recipe_ID, {$set: {
         "nombre": newValue
       }
       });
   }});
   $('#editReferencia.editable').editable({
     placement: "auto top",
     success: function(response, newValue) {
       console.log('set new value to ' + newValue);

       recipe_ID = Session.get("viewRecipe");

       Recetas.update(recipe_ID, {$set: {
         "referencia": newValue
       }
       });
       return " ";
   }
   });
 };


 function collectGeneralData(){
   recipe_ID = Session.get("viewRecipe");
   var nombre = document.getElementById("nombre_receta");
   var referencia = document.getElementById("referencia");
   var fecha = document.getElementById("fecha_receta");
   var zona = document.getElementById("zona_receta");
   var variante = document.getElementById("variante_receta");
   var copia = document.getElementById("copia_receta");
   var equivalentes = document.getElementById("equivalentes");
   var propiedades = document.getElementById("propiedades_receta");
   var consumo = document.getElementById("consumo_recomendado");
   Recetas.update(recipe_ID, {$set: {
     "nombre": nombre.value,
     "referencia": referencia.value,
     "fecha": fecha.value,
     "zona": zona.value,
     "variante": variante.value,
     "copia": copia.value,
     "equivalentes": equivalentes.value,
     "propiedades": propiedades.value,
     "consumo": consumo.value
   }
   });
   return true;
 }


 */
