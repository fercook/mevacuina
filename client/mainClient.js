
Session.set("viewRecipe", null);
Session.set("editRecipe",false);
Session.set("editField",false);


/*Template.body.helpers({
  recetas: function () {
    // Show newest tasks first
    return Recetas.find({}, { sort: { createdAt: -1 }});
  },
  viewRecipe: function () {
    return Session.get("viewRecipe");
  },
  currentRecipe: function (){
    console.log(Session.get("viewRecipe"));
    return Recetas.findOne(Session.get("viewRecipe"));
  },
  ingredientes: function () {
    return Ingredientes.find({},{ sort: { createdAt: -1 }});
  }
});
*/

Template.registerHelper("printThing", function(thing) {
 console.log("Thing: ");
 console.log(thing);
 });

Template.registerHelper("currentRecipe", function (){
  return Recetas.findOne(Session.get("viewRecipe"));
});

Template.registerHelper("recetas",function () {
  // Show newest tasks first
  return Recetas.find({}, { sort: { createdAt: -1 }});
});

Template.registerHelper("viewRecipe", function () {
  return Session.get("viewRecipe");
}
);

Template.registerHelper("TodosLosIngredientes",  function () {
  return Ingredientes.find({},{ sort: { createdAt: -1 }});
}
);


// create events for the 'input' template
/*    Template.input.events = {
// map the event (click) for the control for the given selector
'click input[type=submit]': function (event) {
console.log(event.target.value);
var nombre = document.getElementById('nombre_receta');
var referencia = document.getElementById('referencia');
if (referencia.value != '' && nombre.value != '') {
// add the entry to the list of recipes
Recetas.insert({
nombre: nombre.value,
referencia: referencia.value,
time: Date.now()
});

document.getElementById('referencia').value = '';
document.getElementById('nombre_receta').value = '';
referencia.value = '';
}
Session.set("viewRecipe", null  );
}
}



<li class="player">{{name}}: {{score}}</li>

Template.nom_temp.events ({
'click .player': function(){
console.log("You clicked a .player element");
});


}
*/
