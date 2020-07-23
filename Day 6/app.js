
class Task {
    constructor(id, title) {
      this.id = id;
      this.title = title;
    }
  }

  class TaskListPage {
    constructor() {
      this.tasks = []; 
      const url = "https://day-5-ix.firebaseio.com/tasks.json";
      fetch(url)
        .then((response) => {
          response
            .json()
            .then((data) => {
              console.log(data);
              Object.keys(data).forEach(key => {

                const taskId = data[key].id; 
                const taskTitle = data[key].title;
                const task = new Task(taskId, taskTitle);
                this.tasks.push(task);                          //add all tasks+ids to array 
  
                const taskListElement = document.getElementById("taskList"); //get table from HTML file, call it taskListElement
                const row = document.createElement("tr"); //make table row called row
                row.setAttribute("data-task-id", task.id); 
                row.setAttribute("delstatus", "false"); 
                row.innerHTML = `
                <td>${task.title}</td>
                <td><button data-action="edit" data-task-id="${task.id}" class="btn btn-primary">Edit</button></td>
                <td><button data-action="edit" data-task-id="${task.id}" delstatus="true" class="btn btn-primary">Delete</button></td>
                `;
                taskListElement.appendChild(row); //make a row w two cells, one with the task title, one with the id+buttom
              });
            })
            .catch((err) => console.log("Err", err));
        })
        .catch((err) => console.log("Oops:", err));  /**/
    }
    delstatus="true"
    addTask(title) {
      const taskId = this.tasks.length+1; //taskId = number position in list (1st, 2nd, 3, 4)
      const task = new Task(taskId, title); //use Task class to make new task called task
      this.tasks.push(task); //add new task to task list 
  
      const taskListElement = document.getElementById("taskList"); //get table from HTML file, call it taskListElement
      const row = document.createElement("tr"); //make table row 
      row.setAttribute("data-task-id", task.id); //creation of attribute data-task-id of row
      row.innerHTML = `
      <td>${task.title}</td> 
      <td><button data-action="edit" data-task-id="${task.id}" class="btn btn-primary">Edit</button></td> 
      <td><button data-action="edit" data-task-id="${task.id}" delstatus="true" class="btn btn-primary">Delete</button></td>`; 
      taskListElement.appendChild(row); //add row to table on HTML
      document.getElementById("task").value = ""; //make input box empty
  
     const url = "https://day-5-ix.firebaseio.com/tasks.json";
  
      fetch(url, {  
        method: "POST", //send following data to database
        headers: {
          "Content-Type": "application/json",   //?-----------------------------------------------
          "Access-Control-Allow-Origin": "*",   //?------------------------------------------------
        },
        body: JSON.stringify(task), //turn task into string and send to database
      })
        .then((response) => {
          response
            .json() //parse response from database into json
            .then((resData) => console.log(resData)) //print response data
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    }
  
    startEdittingTask(taskId) {
      console.log(this.tasks)
      for (let k = 0; k < this.tasks.length; k++) { //for every task 
        if (this.tasks[k].id == taskId) { //once you reach the row with the matching id as position in array
          console.log("if statement executed")
          const task = this.tasks[k]; //task is now oject in postion of array of row clicked 
          const taskInputElement = document.getElementById("task");
          taskInputElement.value = task.title; //change input bar text in table to value of cell being edited
          taskInputElement.setAttribute("data-task-id", task.id); // make inputed text save in correct row???
          document.getElementById("addBtn").innerText = "Save"; //make the button text save
        }
      }
    }
    saveTaskTitle(taskId, taskTitle) {
  
      const task = this.tasks.find((task) => task.id == taskId);  //find inputted text in array or tasks and meke it the value of task where the task Id matches the cell Id
      console.log(task);
      if (!task) return;
  
      task.title = taskTitle;
  
      const existingRow = document.querySelector(`tr[data-task-id="${task.id}"]`);
      if (!existingRow) return;
      
      const db = firebase.database();
      db.ref('tasks/').once('value').then(function(snapshot) {
        const key = Object.keys(snapshot.val())[task.id-1]
        let taskDb = db.ref('tasks/'+key);
          taskDb.update({
          title: task.title,
      }); 

      existingRow.children[0].innerHTML = task.title;
      const taskInput = document.getElementById("task");
      taskInput.removeAttribute("data-task-id");
      taskInput.value = "";
      document.getElementById("addBtn").innerText = "Add";

      }); 
    }
    

    delTask(taskId){

      const task = this.tasks.find((task) => task.id == taskId);
      const db = firebase.database();
      const existingRow = document.querySelector(`tr[data-task-id="${task.id}"]`);
      if (!existingRow) return;

      db.ref('tasks/').once('value').then(function(snapshot) {
        let key = Object.keys(snapshot.val())[task.id-1]
        db.ref('tasks/'+ key).remove();

        existingRow.innerHTML =``; 
        console.log(task.id);

        db.ref('tasks/').once('value').then(function(snapshot) {
              let i = 0;
              Object.keys(snapshot.val()).forEach(key => {
              let taskDb = db.ref('tasks/'+ key);
              i++
                taskDb.update({
                  id: i,
                }); 
       
              })          
        })
      });
      let test = this.tasks;
      console.log(test[task.id-1])
      console.log(test.splice(task.id-1,1));
      console.log(test);
    }
  }

  
  const taskListPage = new TaskListPage( );
  
  document.getElementById("addBtn").addEventListener("click", (e) => {
    const taskInputElement = document.getElementById("task");
    const taskTitle = taskInputElement.value; //grab task title from input
  
    const existingTaskId = taskInputElement.getAttribute("data-task-id");
    if (existingTaskId) { //if the task has an id
      taskListPage.saveTaskTitle(existingTaskId, taskTitle); //edit the task
    } else {
      taskListPage.addTask(taskTitle); //create new task
    }
  });
  
  document.getElementById("taskList").addEventListener("click", (e) => {
    const taskId = e.target.getAttribute("data-task-id");
    const action = e.target.getAttribute("data-action");
    if (action !== "edit") return;

    if (e.target.getAttribute("delstatus") == "true"){
      console.log("del status is true");
      taskListPage.delTask(taskId);
    }
    else{
      const taskId = e.target.getAttribute("data-task-id");
      console.log("del status is false" + taskId);
      taskListPage.startEdittingTask(taskId);
    }

  });
