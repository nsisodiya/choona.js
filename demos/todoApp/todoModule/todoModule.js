(function () {
  "use strict";

  App.todoModule = choona.View.extend({
    template : "todoModule/todoModule.html",
    globalEvents: {

    },
    events:{
      "click .toggle"   : "toggleDone",
      "dblclick .view"  : "edit",
      "click a.destroy" : "clear",
      "keyup .edit"  : "updateOnEnter",
      "blur .edit"      : "close",

      "keyup #new-todo":  "createOnEnter",
      "click #clear-completed": "clearCompleted",
      "click #toggle-all": "toggleAllComplete"
    },
    initialize: function () {
      choona.View.apply(this, arguments);
      var self = this;
      $.get("todoModule/todoModuleMainTemplate.html").done(function (data) {
        self.todoModuleMainTemplate = data;
        self.renderMainTemplate();
      });
      this.model = new App.todoDataKlass();
      this.model.on("change", function () {
        self.renderMainTemplate();
      });
    },
    edit: function (e, ele) {
      $(ele).closest('li').addClass("editing");
    },
    updateOnEnter: function (e, ele) {
      if(e.keyCode === 13){
       this.model.update( $(ele).val(), $(ele).closest("li").data("index"));
      }
    },
    close: function (e, ele) {
      $(ele).closest('li').removeClass("editing");
    },
    toggleAllComplete: function (e, ele) {

      if(ele.checked){
        this.model.markAllComplete();
      }else{
        this.model.markAllUnfinished();
      }
    },
    createOnEnter: function (e) {
      if(e.keyCode === 13){
        this.model.addNewTodo(e.target.value);
        e.target.value = "";
      }
    },
    toggleDone: function (e, ele) {
      this.model.toggle($(ele).closest("li").data("index"));
    },

    clearCompleted: function (e, ele) {
      this.model.deleteCompleted();
    },
    renderMainTemplate: function () {
      console.log("Render");
      this.$$.find("#mainTempalte").html(_.template(this.todoModuleMainTemplate, this.model));
    },
    end: function () {

    }
  });
})();

