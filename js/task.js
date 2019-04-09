
class Task {

  constructor(title, color) {
    if (Task.colors.includes(color)) {
      if ((title.length>0)) {
        this.id = new Date().valueOf();
        this.title = title;
        this.color = color;
        this.stage = "icebox";
      } else { throw "invalid title"; }
    } else { throw "invalid color"; }
  }

  static colors = ["red", "pink", "purple", "blue", "indigo", "orange", "yellow", "green"];

  // returns html li element
  static getHTMLElement(task) {
    var li = $(document.createElement("li"));
    li.text(task.title);
    li.attr("task_id", task.id);
    li.addClass("card card-"+task.color);
    return li;
  }
}
