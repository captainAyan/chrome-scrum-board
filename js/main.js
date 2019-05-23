
var taskHelper, core;

function main() {
  core = new Core(localStorage);
  taskHelper = new Task.Helper(core);

  $("#create-btn-main").on("click",(e) => { makeTask(0) })
  $("#create-btn-started").on("click",(e) => { makeTask(1) })
  $("#create-btn-done").on("click",(e) => { makeTask(2) })

  // enable list sorting
  $( "ul" ).sortable({
    connectWith: ".dragable",
    update: (event, ul) => { saveState(); }
  }).disableSelection();

  setupUI();
  setupDate();
}

function setupUI() {
  $( ".task-container" ).empty();
  taskHelper.core.data.tasks.forEach(e => {
    task = new Task(e);
    $(document.getElementsByClassName("task-container")[task.stage])
      .append($(getHTMLElement(task)).hide().fadeIn(200))
  });
}

function setupDate() {
  const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday",
  "Friday", "Saturday"]

  let d = new Date();
  d.setDate(d.getDate()-3);

  for (var i = 0; i < document.getElementsByClassName("day").length; i++) {
    d.setDate(d.getDate()+1);
    el = document.getElementsByClassName("day")[i];
    el.getElementsByTagName("b")[0].innerText = dayNames[d.getDay()];
    el.getElementsByTagName("p")[0].innerText = monthNames[d.getMonth()] + " " + d.getDate();
  }
}

function makeTask(stage) {
  let head = document.getElementById("new-task-head").value.trim();
  let body = document.getElementById("new-task-body").value.trim();
  let color = document.getElementById("new-task-color").value;

  if ((head.length>0) && (body.length>0)) {
    document.getElementById("new-task-head").value="";
    document.getElementById("new-task-body").value="";
    let task = new Task.Builder(head, body, color, stage)
    task.create(taskHelper);

    $(document.getElementsByClassName("task-container")[stage])
      .append($(getHTMLElement(task)).hide().fadeIn(200))
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

function saveState() {
  var new_arr = [];

  for (var i = 0; i < document.getElementsByClassName("task-container").length; i++) {
    p_el = document.getElementsByClassName("task-container")[i];

    for (var j = 0; j < p_el.getElementsByClassName("card").length; j++) {
      c_el = p_el.getElementsByClassName("card")[j];
      new_arr.push({id: parseInt(c_el.getAttribute("task_id")), stage: i})
    }
  }
  taskHelper.taskRearrange(new_arr)
  console.log("state saved");
}

function deleteTask() {
  for (var i = 0; i < document.getElementsByClassName("card done").length; i++) {
    $(document.getElementsByClassName("card done")[i]).fadeOut(200, function() {
      taskHelper.taskDelete(parseInt(this.getAttribute("task_id")))
      $(this).remove();
    });
  }
}

function resetDate() {
  $(".card").fadeOut(200, function() {
    taskHelper.taskDelete(parseInt(this.getAttribute("task_id")))
    $(this).remove();
  });
  saveState();
}

// start program
$(document).ready(e => { main(); });
