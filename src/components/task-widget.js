/**
 * A Task widget that displays tasks pulled from 
 * an API
 * 
 * <task-block></task-block>
 */

import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';
import { BASE_URL } from '../config.js';
import { getUser } from '../auth.js';

class TaskWidget extends LitElement {
  static properties = {
    user: {state: true},
    _tasks: { state: true },
    _form: {state: true},
    editingTaskId : {state: true},
    auth: {state: true},
    pendingTasks: {state: true},
    progressTasks: {state: true},
    completeTasks: {state: true},
    showForm: {state: true},

  }

  static styles = css`
  :host {
    margin: 1em;
  }
  .blogpost {
    text-align: left;
  }
  .blogpost h2 {
    background-color: pink;
    text-transform: capitalize;
  }
  .logon{
    font-style: italic;
    background-image: linear-gradient(180deg,#828282,#646464);
    padding: 10px;
    color: white;
    border-radius: 5px;
    font-size: 14px;
  }
  .task-list h1 {
    background: #d7d7d7;
    display: flex;
    padding: 10px 20px;
    border-radius: 10px 10px 0 0;
    margin: 0;
   
}
.task-list span{
  width: 100px;

  padding: 5px;
    border-radius: 20px;
    color: black;
    font-size: 14px;
    
    font-weight: normal;

}
.task-list.pending span{
  background: #FFA2A2;
}
.task-list.progress span{
  background: #A7E6FF;
}
.task-list.complete span{
  background: #B3EC8D;
}
.tasks h2{
  font-size: 14px;
    font-weight: normal;
    text-align: left;
    margin: 0;
    border-bottom: 1px solid lightgray;
    padding-bottom: 8px;
    padding-top: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.tasks button{
  background: rgb(215, 215, 215);
  border: 0px;
  padding: 8px 20px;
  border-radius: 5px;
  margin-top: 10px;
  color: black;
  margin-bottom: 10px;
  font-family: 'DynaPuff';
}
.tasks select{
  background: rgb(246, 246, 246);
  color: black;
  border-radius: 5px;
  letter-spacing: 0.05em;
  padding: 5px;
  font-family: 'DynaPuff';
}
.task-list{
margin-bottom:20px;
box-shadow: rgba(0, 0, 0, 0.22) 0px 3px 4px -2px
}
.tasks{
  padding:0 15px;
  background: rgb(243, 242, 238);
}
#blog-form{
  margin-bottom: 20px;
    background: white;
    padding: 20px 10px;
    box-shadow: rgba(0, 0, 0, 0.22) 0px 3px 4px -2px;
}
.task-list p{
  margin: 0;
  padding: 15px 0;
}
.tasks .edit-button{
  padding: 0;
  background: none;
}
#blog-form h1{
  color: #373a36;
  font-size: 20px;
}
#blog-form input{
  background: rgb(243, 242, 238);
    border: 0;
    padding: 5px 20px;
    width: calc(100% - 40px);
    border-radius: 30px;
    height: 40px;
    font-family: 'DynaPuff', cursive;
}
#blog-form button{
  background: rgb(166, 25, 46);
  border: 0px;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  width: 100%;
  padding: 10px 20px;
  border-radius: 20px;
  margin-top: 15px;
  font-family: 'DynaPuff';
}
.new-task-button{
  background: rgb(215, 215, 215);
  border: 0;
  color: rgb(98 100 123);
  padding: 10px 20px;
  margin-bottom: 12px;
  border-radius: 5px;
  margin-left: -20px;
  width: 100%;
  font-family: 'DynaPuff';
}
  `;

  constructor() {
    super();
    this.showForm=false;
    this.user = getUser();
    if(this.user){
      this.auth = this.user.token;
    }
    window.addEventListener('user', () => {
      this.user = getUser();
      if(this.user){
        this.auth = this.user.token;
        this.fetchData();
      }
      this.requestUpdate();
     
    });
    this.fetchData();
      }
      
      fetchData(){
      
        const taskUrl =`${BASE_URL}tasks`;
      fetch(taskUrl, {
      headers: {
        'Authorization': "Basic " + this.auth
      }
    })
        .then(response => response.json())
        .then(tasks => {
            this._tasks = tasks.tasks;
            console.log(this._tasks); 
            this.pendingTasks = this._tasks.filter((task) => task.status === "Pending" ||  task.status === "pending");
            this.progressTasks = this._tasks.filter((task) => task.status === "In Progress");
            this.completeTasks = this._tasks.filter((task) => task.status === "Complete");
            console.log(this.pendingTasks);
            console.log(this.progressTasks);
            console.log(this.completeTasks);
        });
  }
      submitTask(event){
        event.preventDefault();
        const text = event.target.text.value;
    
        const auth = this.user.token;
        console.log(auth);
        const data = {
      
                text:text,
    
                }
    
        console.log(JSON.stringify(data));
    
        fetch('https://comp2110-portal-server.fly.dev/tasks/', 
               {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': "Basic " + auth
                },
                body: JSON.stringify(data)
            })
        .then(response => response.json())
        .then(data => {
    
            console.log(data)
            this.fetchData();
        });
      }
      cancelEdit(){
        this.editingTaskId=null;
    
      }
      editTask(id){
        console.log(id);
        this.editingTaskId=id;
      }
      updateTask(event, id){
     event.preventDefault();
        const text = event.target.text.value;
        const status = event.target.status.value;
    
        const auth = this.user.token;
        console.log(auth);
        const data = {
      
                text:text,
                status: status,
    
                }
    
        console.log(JSON.stringify(data));
    
        fetch('https://comp2110-portal-server.fly.dev/tasks/'+id, 
               {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': "Basic " + auth
                },
                body: JSON.stringify(data)
            })
        .then(response => response.json())
        .then(data => {
    
            console.log(data)
            this.fetchData();
            
        });
        
        this.editingTaskId=null;
    
    
      }
    
      
      
  renderHTML(id, text,status){
    return html`
    <div class="tasks">
      <h2 id="text-${id}">${text}
      <div style="width:50px;text-align:right;justify-content:right;display: flex;">
      ${this.editingTaskId != id 
        ? html `
        <button class="edit-button" @click=${() => this.editTask(id, text, status)}><img src="/../src/assets/images/edit.png" width="12"></button>
       
        `
        
        :
      html `<button class="edit-button" @click=${() => this.cancelEdit()}><img src="/../src/assets/images/cancel.png" width="12"></button>`
        }
       
     </div>
        </h2>
      
      ${ this.editingTaskId === id
      
      ? html`
          
          <form @submit=${(event) => this.updateTask(event, id)}>

              <input hidden type="text" name="text" placeholder="Enter task" value="${text}">
              <select name="status">
                  ${status === "pending" ?  html `<option value="Pending" selected >Pending</option>`: html   `<option value="Pending" >Pending</option>`}
                  ${status === "In Progress" ?  html `<option value="In Progress" selected >In Progress</option>`: html   `<option value="In Progress" >In Progress</option>`}
                  ${status === "Complete" ?  html `<option value="Complete" selected >Complete</option>`: html   `<option value="Complete" >Complete</option>`}
              </select>
              <button type="submit" value="Post" placeholder="Insert content here...">Update</button>
          </form>
          `
      : null}

      
    </div>


    `
  }
  displayForm(){
    this.showForm=true;
  }
  cancelForm(){
    this.showForm=false;
  }
  
  render() {
    
    
      if (this.user) {
        if (!this._tasks)
        
      return html`Loading...`
        return html`
        ${this.showForm ?
          html `
          <button class="new-task-button" @click=${this.cancelForm}><img src="/../src/assets/images/cancel.png" width="12" style="margin-right:5px;"> Cancel New Task</button>

          <form id="blog-form" @submit=${this.submitTask}>
          <h1>Create new task</h1>
          <input type="text" name="text" placeholder="Enter task">
          <button type="submit" value="Post" placeholder="Insert content here...">Post</button>
        </form>
          `
          :
          html `
          <button class="new-task-button" @click=${this.displayForm}>+ Add New Task</button>
          `

        }
          
         
        <div class="task-list pending">
        <h1><span>Pending</span></h1>
        ${this.pendingTasks.length !=0 ?
          html `
          ${this.pendingTasks.map(
            (task) => this.renderHTML(task.id, task.text, task.status)
        
        )}`
        :
            html `<p style="font-size:14px;">0 pending tasks</p>`
        }
          
        </div>
        <div class="task-list progress">
        <h1><span>In Progress</span></h1>
        ${this.progressTasks.length !=0 ?
          html `
          ${this.progressTasks.map(
            (task) => this.renderHTML(task.id, task.text, task.status)
        
        )}`
        :
            html `<p style="font-size:14px;">0 in progress tasks</p>`
        }
          
       
        </div>
        <div class="task-list complete">
        <h1><span>Complete</span></h1>
        ${this.completeTasks.length !=0 ?
          html `
          ${this.completeTasks.map(
            (task) => this.renderHTML(task.id, task.text, task.status)
        
        )}`
        :
            html `<p style="font-size:14px;">0 completed tasks</p>`
        }
          
        `
      } 
      else{
        return html`

        <p class="logon">Please log in to see tasks.</p>
            
        `;
      }
       
      
  }

  
   
  
}




customElements.define('task-block', TaskWidget);


