
class Task {
    constructor(id, title, priority) {
      this.id = id;
      this.title = title;
      this.priority = priority;
    }
  }

  class TaskListPage {
    constructor() {
      const db = firebase.database();
      this.tasks = [];
      this.priorityList = [];

      db.ref().update({
          priority: {
            High: {
              bootstrapcolor: "danger",
              shortfrom: "H"
            },
            Medium: {
              bootstrapcolor: "success",
              shortfrom: "M"
            },
            Low: {
              bootstrapcolor: "warning",
              shortfrom: "L"
            }
          }  
        })

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
                const taskPriority = data[key].priority;
  
                const task = new Task(taskId, taskTitle, taskPriority);
                this.tasks.push(task);                          
  
                const taskListElement = document.getElementById("taskList"); 
                const row = document.createElement("tr");
                row.setAttribute("data-task-id", task.id); 
                row.setAttribute("delstatus", "false"); 

                //this.priorityRender()

                row.innerHTML = `
                <td>${task.title}   ${this.priorityRender(task.priority)}</td>
                <td><button data-action="edit" data-task-id="${task.id}" class="btn btn-primary">Edit</button></td>
                <td><button data-action="edit" data-task-id="${task.id}" delstatus="true" class="btn btn-primary">Delete</button></td>
                `;
          
                taskListElement.appendChild(row);
              });
            })
            .catch((err) => console.log("Err", err));
        })
        .catch((err) => console.log("Oops:", err));  
    
    }

    priorityRender(priority){
      let db = firebase.database()
      let ref = db.ref('/priority/'+priority+'/bootstrapcolor')
      const row = document.createElement("tr");
      // ref.on('value', function(snapshot){
      //   const row = document.createElement("tr");
      //   console.log(row)
      //   row.innerHTML = `<span class="badge badge-pill badge-${snapshot.val()}"> ${priority} </span>`
      // })
      if(priority == "High"){return (row.innerHTML = `<span class="badge badge-pill badge-danger"> ${priority} </span>`)}
      if(priority == "Medium"){return (row.innerHTML = `<span class="badge badge-pill badge-warning"> ${priority} </span>`)}
      if(priority == "Low"){return (row.innerHTML = `<span class="badge badge-pill badge-success"> ${priority} </span>`)}
    }

    highPriority(){
      this.priority = "High"
      document.getElementById("dropDown").innerText = "High"
      console.log(this.priority)
    }
    
    midPriority(){
      this.priority = "Medium"
      document.getElementById("dropDown").innerText = "Medium"
      console.log(this.priority)
    }
    
    lowPriority(){
      this.priority = "Low"
      document.getElementById("dropDown").innerText = "Low"
      console.log(this.priority)
    }

    
    addTaskDB(title, id, priority) {
      const db = firebase.database();
      let taskDb = db.ref('tasks/');
      taskDb.push({"title":title, "id": id, "priority":priority});
      }

    addTask(title) {
        document.getElementById("task").value = ""; 
        const taskListElement = document.getElementById("taskList");          
        const row = document.createElement("tr");                              
        let idNum = this.tasks.length + 1;
        const task = new Task(idNum, title);
        this.tasks.push(task);
        
        row.setAttribute("data-task-id", task.id); 

        console.log(this.priority)

        if(this.priority == "High"){
          row.innerHTML = `
          <td>${task.title}    <span class="badge badge-pill badge-danger">High</span></td>
          <td><button data-action="edit" data-task-id="${task.id}" class="btn btn-primary">Edit</button></td>
          <td><button data-action="edit" data-task-id="${task.id}" delstatus="true" class="btn btn-primary">Delete</button></td>
          `;
          taskListElement.appendChild(row);
          this.addTaskDB(title, task.id, this.priority);
        }
        else if(this.priority == "Medium"){
          row.innerHTML = `
          <td>${task.title}    <span class="badge badge-pill badge-warning">Medium</span></td>
          <td><button data-action="edit" data-task-id="${task.id}" class="btn btn-primary">Edit</button></td>
          <td><button data-action="edit" data-task-id="${task.id}" delstatus="true" class="btn btn-primary">Delete</button></td>
          `;
          taskListElement.appendChild(row);
          this.addTaskDB(title, task.id, this.priority);
        }
        else if(this.priority == "Low"){
          row.innerHTML = `
          <td>${task.title}    <span class="badge badge-pill badge-success">Low</span></td>
          <td><button data-action="edit" data-task-id="${task.id}" class="btn btn-primary">Edit</button></td>
          <td><button data-action="edit" data-task-id="${task.id}" delstatus="true" class="btn btn-primary">Delete</button></td>
          `;
          taskListElement.appendChild(row);
          this.addTaskDB(title, task.id, this.priority);
        }      
        console.log(this.tasks);
      }

  
      editTask(taskId) {
        console.log("edit")

        const task = this.tasks.find((task) => task.id == taskId); 
        console.log(task);
        document.getElementById("task").value = task.title; 
        document.getElementById("task").setAttribute("data-task-id", task.id); 
        console.log(this.tasks[taskId-1].title)
        document.getElementById("addBtn").innerText = "Save"; 
        console.log(this.tasks);
      }

      saveTaskTitle(taskId) {
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
        var delayInMilliseconds = 1500; //1.5 second
        setTimeout(function() {
         window.location.reload()
        }, delayInMilliseconds);
      }
  }

  
  const taskListPage = new TaskListPage();
  
  document.getElementById("highPrio").addEventListener("click", (e) => {
    taskListPage.highPriority()    
  });

  document.getElementById("midPrio").addEventListener("click", (e) => {
    taskListPage.midPriority()  
  })

  document.getElementById("lowPrio").addEventListener("click", (e) => {
    taskListPage.lowPriority()  
  })

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

 /*    if(this.priority == "H"){
        return(
        row.innerHTML = `
        <td>${task.title}   ${task.priority}   <span class="badge badge-pill badge-danger">H</span></td>
        <td><button data-action="edit" data-task-id="${task.id}" class="btn btn-primary">Edit</button></td>
        <td><button data-action="edit" data-task-id="${task.id}" delstatus="true" class="btn btn-primary">Delete</button></td>
        `)
      }
      else if(this.priority == "M"){
        return(
        row.innerHTML = `
        <td>${task.title}   ${task.priority}    <span class="badge badge-pill badge-warning">M</span></td>
        <td><button data-action="edit" data-task-id="${task.id}" class="btn btn-primary">Edit</button></td>
        <td><button data-action="edit" data-task-id="${task.id}" delstatus="true" class="btn btn-primary">Delete</button></td>
        `)
      }
      else if(this.priority == "L"){
        return(
        row.innerHTML = `
        <td>${task.title}   ${task.priority}  <span class="badge badge-pill badge-success">L</span></td>
        <td><button data-action="edit" data-task-id="${task.id}" class="btn btn-primary">Edit</button></td>
        <td><button data-action="edit" data-task-id="${task.id}" delstatus="true" class="btn btn-primary">Delete</button></td>
        `)
      } */