
Template.editField.helpers({
   printField: function(obj, fieldname) {
     return obj[fieldname];
    }
  });

Template.editField.events({
  "click .edit_field_button": function(event){
    event.preventDefault();
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
