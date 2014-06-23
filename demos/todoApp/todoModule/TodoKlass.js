
(function () {
  "use strict";
  App.todoDataKlass = choona.Model.extend({

    initialize: function () {
      choona.Model.call(this);
      this.todoList = [];

    },
    addNewTodo: function (title) {
      this.todoList.push({
        title: title,
        done: false
      });
      this.trigger("change");
    },
    update: function (title, index) {
      this.todoList[index].title = title;
      this.trigger("change");
    },
    totalCompletedItems: function () {
      return this.todoList.filter(function (v,i) {
        return v.done === true;
      }).length;
    },
    totalUnfinishedItems: function () {
      return this.todoList.filter(function (v,i) {
        return v.done === false;
      }).length;
    },
    toggle: function (index) {
      this.todoList[index].done = ! this.todoList[index].done;
      this.trigger("change");
    },
    removeTodo: function(index){
      this.todoList.splice(index, 1);
      this.trigger("change");
    },
    markComplete: function (index) {
      this.todoList[index].done = true;
      this.trigger("change");
    },
    markUnfinished: function (index) {
      this.todoList[index].done = false;
      this.trigger("change");
    },
    markAllComplete: function (index) {
      for(var i = 0; i < this.todoList.length; i++){
        this.markComplete(i);
      }
      this.trigger("change");
      
    },
    markAllUnfinished: function (index) {
      for(var i = 0; i < this.todoList.length; i++){
        this.markUnfinished(i);
      }
      this.trigger("change");
    },
    deleteCompleted: function () {
      for(var i = 0; i < this.todoList.length; i++){
        if(this.todoList[i].done === true){
          this.removeTodo(i);
          i--;
        }
      }
      this.trigger("change");
    }
  });
})();
