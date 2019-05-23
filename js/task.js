'use strict';

class Task {

  constructor(task) {
    if (task.id) { if(task.head) { if (task.title) { if (task.color) { if (task.stage >=0 && task.stage <=2) {
      this.id = task.id;
      this.head = task.head;
      this.title = task.title;
      this.done = task.done;
      this.color = task.color;
      this.stage = task.stage;
    } else { throw "invalid stage" }} else { throw "invalid color"}} else { throw "invalid title" }} else { throw "invalid head" } } else { throw "invalid id"; }
  }

  static Builder = class {
    constructor(title, head, color, stage) {
      if (Task.Builder.colors.includes(color)) {
        if ((title.length>0) && (head.length)>0) {
          if ( (stage >= 0) && (stage <= 2) ) {
            this.id = new Date().valueOf();
            this.head = head;
            this.title = title;
            this.done = false;
            this.color = color;
            this.stage = stage;
          } else { throw "invalid stage" }
        } else { throw "invalid title or head"; }
      } else { throw "invalid color"; }
    }

    create(helper) {
      if (helper instanceof Task.Helper) {
        helper.addTask(this);
      } else { throw "instance of Task.Helper class is required" }
    }

    static colors = ["red", "pink", "purple", "blue", "indigo", "orange", "yellow", "green"];
  }

  static Helper = class {
    constructor(core) {
      if (core instanceof Core) {
        this.core = core;
      } else { throw "instance of Core class required" }
    }

    // takes Task.Builder() object and creates task on DB
    addTask(task) {
      if (task instanceof Task.Builder) {
        this.core.data.tasks.push(task);
        core.commit()
      } else { throw "instance of Task.Builder class is required" }
    }

    // takes integer id and marks that task as done from DB
    taskDoneToggle(id) {
      this.core.data.tasks.forEach(task => {
        if (task.id == id) { task.done = !task.done }
      })
      this.core.commit()
    }

    // takes {id: int, stage: int } *arranged array and rearranges the DB
    taskRearrange(t_arr) {
      var task_arr = [];
      t_arr.forEach(tuple => {
        this.core.data.tasks.forEach(task => {
          if (task.id == tuple.id) {
            let t = new Task(task);
            t.stage = tuple.stage;
            task_arr.push(t)
          }
        })
      })
      this.core.data.tasks = task_arr;
      this.core.commit();
    }

    // takes integer id and deletes that task from DB
    taskDelete(id) {
      var task_arr = [];
      this.core.data.tasks.forEach((task,i) => {
        if (task.id != id) { task_arr.push(task) }
      })
      this.core.data.tasks = task_arr;
      this.core.commit()
    }

  }
}
