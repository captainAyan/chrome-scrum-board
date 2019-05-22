
var taskHelper, core;

function main() {
  core = new Core(localStorage);
  taskHelper = new Task.Helper(core);

  $("#create-btn-main").on("click",(e) => { mktask(0) })
  $("#create-btn-started").on("click",(e) => { mktask(1) })
  $("#create-btn-done").on("click",(e) => { mktask(2) })

  // enable list sorting
  $( "ul" ).sortable({
    connectWith: ".dragable",
    update: (event, ul) => {
      var new_arr = [];

      for (var i = 0; i < document.getElementsByClassName("task-container").length; i++) {
        p_el = document.getElementsByClassName("task-container")[i];

        for (var j = 0; j < p_el.getElementsByClassName("card").length; j++) {
          c_el = p_el.getElementsByClassName("card")[j];
          new_arr.push({id: c_el.getAttribute("task_id"), stage: i})
        }
      }
      taskHelper.taskRearrange(new_arr)
    }
  }).disableSelection();

  setupUI();
}

function setupUI() {
  $( ".task-container" ).empty();
  taskHelper.core.data.tasks.forEach(e => {
    task = new Task(e);
    document.getElementsByClassName("task-container")[task.stage].append(getHTMLElement(task))
  });
}


function mktask(stage) {
  let head = document.getElementById("new-task-head").value;
  let body = document.getElementById("new-task-body").value;
  let color = document.getElementById("new-task-color").value;

  if ((head.length>0) && (body.length>0)) {
    document.getElementById("new-task-head").value="";
    document.getElementById("new-task-body").value="";
    document.getElementById("new-task-color").value="";
    new Task.Builder(head, body, color, stage).create(taskHelper);
    setupUI();
  }
}


function getHTMLElement(task) {
  var li = document.createElement("li");

  var head_container = document.createElement("div")
  head_container.setAttribute("class", "header-container");

  var head = document.createElement("label");
  head.innerHTML = task.head;
  head.setAttribute("class", "header")

  head_container.append(head)
  li.append(head_container)

  var check = document.createElement("input");
  check.setAttribute("type", "checkbox");

  if(task.done) check.setAttribute("checked", "");

  check.addEventListener( 'change', (e) => {
    if(check.checked) { li.classList.add("done") }
    else { li.classList.remove("done") }
    taskHelper.taskDoneToggle(task.id)
  });
  li.append(check);

  var body = document.createElement("span")
  body.innerText = task.title;
  body.setAttribute("class", "body");
  li.append(body);

  li.setAttribute("task_id", task.id);
  li.setAttribute("class", "card card-"+task.color+" "+(task.done ? "done": ""));

  return li;
}


// start program
$(document).ready(e => { main(); });
