// ES6 Classes


// Task Class
class Task {
    constructor(task) {
      this.task = task;
    }
  }
  
  // UI Class
  class UI {
    addTask(taskName) { 
      let list = document.getElementById("task-list");
      let row = document.createElement("tr");
      row.innerHTML = 
      `
        <td class="edit" contenteditable="true">${taskName.task}</td>
        <td><button class="button btn btn-outline-secondary" type="button"><img src="edit.png"></img></button></td>
      `;
      list.appendChild(row);
      console.log(list, typeof list);
      console.log(row, typeof row);
    }

        

    clearFields() { 
      document.getElementById("task").value = "";
    }
  
    deleteTask(target) {
      if (target.task === "delete") {
        target.parentElement.parentElement.remove();
      }
    }
  }
  
  // Event Listeners
  document.getElementById("list").addEventListener("click", function (e) {
    const taskName = document.getElementById("task").value;
    const task = new Task(taskName);
    
      const ui = new UI();
      ui.addTask(task);
      ui.clearFields();
  
      e.preventDefault();
    });
 
 
  // Delete Task
  document.getElementById("list").addEventListener("click", function (e) {
    const ui = new UI();
    ui.deleteTask(e.target);
    e.preventDefault();
  });


/*`
        <td id="edit" contenteditable="false">${taskName.task}</td>
        <td id="button"><button class="edit btn btn-outline-secondary" type="button"><img id="img" src="edit.png"></img></button></td>

             document.getElementById("button").addEventListener("click", function(e){
        document.getElementById("edit").contentEditable = true;
        document.getElementById("img").src ="check.png";
        document.getElementById("edit").style.backgroundColor ="#e8f8ff";
        document.getElementById("button").addEventListener("click", function(e){
          document.getElementById("edit").contentEditable = false;
          document.getElementById("edit").style.backgroundColor ="white";
          document.getElementById("img").src ="edit.png";
        })
      });
z */