
class Task {
    constructor(id, title) {
      this.id = id;
      this.title = title;
    }
  }

  class TaskListPage {
    constructor() {
      const db = firebase.database();
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
    
    addTaskDB(title, id) {
      const db = firebase.database();
      let taskDb = db.ref('tasks/');
      taskDb.push({"title":title, "id": id});
      }

    addTask(title) {
        document.getElementById("task").value = ""; 
        const taskListElement = document.getElementById("taskList");          
        const row = document.createElement("tr");                              
        let idNum = this.tasks.length + 1;
        const task = new Task(idNum, title);
        this.tasks.push(task);
        row.setAttribute("data-task-id", task.id); 
        row.innerHTML = `
        <td>${task.title}</td>
        <td><button data-action="edit" data-task-id="${task.id}" class="btn btn-primary">Edit</button></td>
        <td><button data-action="edit" data-task-id="${task.id}" delstatus="true" class="btn btn-primary">Delete</button></td>
        `;
        taskListElement.appendChild(row);
        this.addTaskDB(title, task.id);
        console.log(this.tasks);
      }

  
      editTask(taskId, taskTitle) {
        console.log("edit")

        const task = this.tasks.find((task) => task.id == taskId); 
        console.log(task);
        document.getElementById("task").value = task.title; 
        document.getElementById("task").setAttribute("data-task-id", task.id); // cue to edit on event listener 
        console.log(this.tasks[taskId-1].title)
        document.getElementById("addBtn").innerText = "Save"; 
        console.log(this.tasks);
      }

      saveTaskTitle(taskId, taskTitle) {
         //change array value
         this.tasks[taskId-1].title = document.getElementById("task").value
         console.log(this.tasks[taskId-1].title)

         //change dB value 
          const db = firebase.database();
          db.ref('tasks/').once('value').then(function(snapshot) {
            console.log(snapshot.val())
            const key = Object.keys(snapshot.val())[taskId-1]
            let taskDb = db.ref('tasks/'+key);
              taskDb.update({
              title: document.getElementById("task").value,
          })
          //show changes
          window.location.reload(false)
        }); 
               
      }
      
      delTask(taskId){
        console.log("del")
        const task = this.tasks.find((task) => task.id == taskId); 
        console.log(task);

        console.log(document.querySelector(`tr[data-task-id="${taskId}"]`))
        //document.querySelector(`tr[data-task-id="${taskId}"]`).innerHTML=``
        
        //del array value
        this.tasks.splice(taskId-1, 1)

        var j;
         for (j = 0; j < this.tasks.length; j++) {
            this.tasks[j].id = j+1;
         }
        console.log(this.tasks);

        //del dB value 
        const db = firebase.database();
          db.ref('tasks/').once('value').then(function(snapshot) {
            console.log(snapshot.val())
            const key = Object.keys(snapshot.val())[taskId-1]
            db.ref('tasks/'+ key).remove();   
            

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
          })
        //show changes
        var delayInMilliseconds = 1500; //1 second
        setTimeout(function() {
         window.location.reload()
        }, delayInMilliseconds);
      }

  }

  
  const taskListPage = new TaskListPage();
  
  document.getElementById("addBtn").addEventListener("click", (e) => {
    
    const taskInputElement = document.getElementById("task");
    const title = taskInputElement.value; 
  
    const existingTaskId = taskInputElement.getAttribute("data-task-id");
    if (existingTaskId) { //if the task has an id
      taskListPage.saveTaskTitle(existingTaskId, title); //edit the task
    } 
    else {
      taskListPage.addTask(title); //create new task
    }

  });
  
  document.getElementById("taskList").addEventListener("click", (e) => {
    const taskId = e.target.getAttribute("data-task-id");
    
    if (e.target.getAttribute("delstatus") == "true"){
      //console.log("del status is true");
      taskListPage.delTask(taskId);
    }
    else {
      const taskId = e.target.getAttribute("data-task-id");
      //console.log("del status is false " + taskId);
      taskListPage.editTask(taskId);
    }

  });

  // let taskDb = db.ref('tasks/');
      
  //     taskDb.on('value', function(snapshot) {
  //       let tasksLength = snapshot.numChildren();
  //       const taskListElement = document.getElementById("taskList");        
  //       const row = document.createElement("tr");  
  //      })
       //taskDb.on('value', function(snapshot) {
      //console.log(snapshot.val()); 
      //});
      //console.log(id, title)