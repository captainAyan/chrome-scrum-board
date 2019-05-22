
class Core {

  constructor(ls) {
    var data;
    this.localStorage = ls
    if (this.localStorage.getItem("data") == undefined) {
      this.data = {tasks: []};
      this.localStorage.setItem("data", JSON.stringify(this.data));
    }
    else {
      try { this.data = JSON.parse(this.localStorage.getItem("data")); }
      catch(ex) {
        if (ex instanceof SyntaxError) {
          this.data = {tasks: []};
          this.localStorage.setItem("data", JSON.stringify(this.data));
        }
        else {throw ex;}
      }
    }
  }

  // saves to localStorage
  commit() {
    console.log("commiting")
    this.localStorage.setItem("data", JSON.stringify(this.data));
  }

}
