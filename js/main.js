
var create_task_btn, reset_app_btn, modal, core;

function main() {

  modal = document.getElementById('create_modal');
  create_task_btn = $('#create-btn');
  reset_app_btn = $('#reset-btn');
  core = new Core(localStorage);

  // sortable list
  $( "ul" ).sortable({
    connectWith: ".dragable",
    update: (event, ul) => {
      $(".task-delete").empty();
      var new_arr = [];
      new_arr = new_arr.concat(getTasksFromHTML($("#icebox-container").children(), "icebox"));
      new_arr = new_arr.concat(getTasksFromHTML($("#wip-container").children(), "wip"));
      new_arr = new_arr.concat(getTasksFromHTML($("#testing-container").children(), "testing"));
      new_arr = new_arr.concat(getTasksFromHTML($("#done-container").children(), "done"));

      core.data.tasks = new_arr;
      core.commit(localStorage);

    }
  }).disableSelection();

  setupUI();
  fetchData(core.data);
}

$(document).ready(e => { main(); });


function fetchData(data) {
  var tasks = data.tasks;
  $(".task-container").empty();
  tasks.forEach((task, i) => {
    $("#"+task.stage+"-container").append(Task.getHTMLElement(task));
  });
}

function getTasksFromHTML(tasks, stage) {
  var new_arr = [];
  for (var i = 0; i < tasks.length; i++) {
    task = findFromArray($(tasks[i]).attr("task_id"));
    task.stage = stage;
    new_arr.push(task);
  }
  return new_arr;
}
// finds element core.data.tasks
function findFromArray(nameKey){
  for (var i=0; i < core.data.tasks.length; i++) {
    if (core.data.tasks[i].id == nameKey) {
      return core.data.tasks[i];
    }
  }
}

function setupUI() {
  // All about modal
  create_task_btn.click(function() { $(modal).fadeIn(); });
  function modalOff() {
    $("#modal_title").val("");
    $("#modal_error").val("");
    $("#modal_error").text("");
    fetchData(core.data);
    $(modal).fadeOut();
  }
  window.onclick = function(event) {if (event.target == modal) { modalOff(); }}
  $("#modal_submit").click(e => {
    try {
      var task = new Task($("#modal_title").val(), $("#modal_color").val());
      core.data.tasks.push(task);
      core.commit(localStorage);
      modalOff();
    } catch(ex) { $("#modal_error").text(ex); }
  });

  reset_app_btn.click(function() {delete localStorage.data; location.reload()});
}
