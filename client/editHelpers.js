
function max_steps(process_list){
  var max_step = 0;
  process_list.forEach( function(step){
    if (step.orden>max_step) { max_step = step.orden }
  });
  return max_step;
}


Template.editView.rendered = function () {
    AutoCompletion.init("input#paso_accion");
    AutoCompletion.init("input#paso_nom_ingrediente");
    AutoCompletion.init("input#ing_nombre");
}


Template.editView.events({
  "click .selectable": function(event){
    event.preventDefault();
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
    event.preventDefault();
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
  },

  "click .add_step": function(event) { ////ACA HERE TODO
    event.preventDefault();
    var accion = document.getElementById('step_action');
    process_ID = Procedimientos.findOne({"nombre": accion.value});
    if (! process_ID) {
      process_ID = Procedimientos.insert({
        "nombre": accion.value,
        createdAt: new Date()
      });
    }
    recipe_ID = Session.get("viewRecipe");
    var proceso = Recetas.findOne(recipe_ID).proceso;
    console.log(proceso);
    var max_step = max_steps(proceso);
    console.log(max_step);
    Recetas.update(recipe_ID,
    {$push: {
      proceso:  {
        "ID_proceso": process_ID,
        "accion": accion.value,
        "orden": +max_step+1,
        "como": "",
        "utensilios": "",
        "tiempo": "",
        "condicion": "",
        "ingredientes": [],
        createdAt: new Date()
      }
    }});
    accion.value="";
    return false;
  }

});



/*
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
