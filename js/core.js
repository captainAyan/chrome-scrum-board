
class Core {

  constructor(ls) {
    var data;
    if (ls.getItem("data") == undefined) {
      this.data = {tasks: []};
      ls.setItem("data", JSON.stringify(this.data));
    }
    else {
      try { this.data = JSON.parse(ls.getItem("data")); }
      catch(ex) {
        if (ex instanceof SyntaxError) {
          this.data = {tasks: []};
          ls.setItem("data", JSON.stringify(this.data));
        }
        else {throw ex;}
      }
    }
  }

  // saves to localStorage
  commit(localStorage) {
    localStorage.setItem("data", JSON.stringify(this.data));
  }

}
