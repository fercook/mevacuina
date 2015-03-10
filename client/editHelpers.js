Template.editView.helpers({
  editStep1: function () {
    return Session.get("editStep1");
  },
  editStep2: function () {
    return Session.get("editStep2");
  },
  editStep3: function () {
    return Session.get("editStep3");
  },
  editAllSteps: function() {
    return Session.get("editAllSteps");
  } /*,
  ingredientesReceta: function () {
    recipe_ID = Session.get("viewRecipe");
    var theIngredients = Recetas.findOne(recipe_ID).ingredientes;
    var idx=0;
    theIngredients.forEach(function(d) {d.idx = idx; idx++;});
    console.log(theIngredients);
    return theIngredients;
  }
  */
  });


  Template.editView.rendered = function () {
    AutoCompletion.init("input#paso_accion");
    AutoCompletion.init("input#paso_nom_ingrediente");
    AutoCompletion.init("input#ing_nombre");
  }


Template.editView.events({
/*
  "submit form": function(event){
    event.preventDefault();
    event.stopPropagation();
    console.log(event.type);
    return false;
  },
*/
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

  "click .continue1": function(event) {
    event.preventDefault();
    collectGeneralData();
    Session.set("editStep1", false);
    Session.set("editStep2", true);
    return false;
  },

  "click .back2": function(event) {
    event.preventDefault();
    Session.set("editStep1", true);
    Session.set("editStep2", false);
    return false;
  },

  "click .back3": function(event) {
    event.preventDefault();
    Session.set("editStep1", false);
    Session.set("editStep2", true);
    Session.set("editStep3", false);
    return false;
  },

  "click .continue2": function(event) {
    event.preventDefault();
    Session.set("editStep2", false);
    Session.set("editStep3", true);
    return false;
  },

  "click .continue3": function(event) {
    event.preventDefault();
    Session.set("editStep3", false);
    Session.set("editAllSteps",false);
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

  "click .add_ingredient": function(event) {
    var cantidad = document.getElementById('ing_cantidad');
    var tipo = document.getElementById('ing_tipo');
    var nombre = document.getElementById('ing_nombre');
    var alternativos = document.getElementById('ing_alternativos');
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
           "tipo": tipo.value,
           "cantidad": +cantidad.value,
           "alternativos": alternativos.value,
           createdAt: new Date()
           }
         }});
    cantidad.value=""; tipo.value=""; nombre.value=""; alternativos.value="";
    return false;
  }

});

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



Template.UnIngrediente.events({
  "click .item": function(event) {

  },
  "click .delete": function(event) {
    recipe_ID = Session.get("viewRecipe");
    Recetas.update(recipe_ID,
    {$pull: {ingredientes:
      {alternativos: this.alternativos,
        cantidad: this.cantidad,
        nombre: this.nombre,
        tipo: this.tipo
      }}});
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
