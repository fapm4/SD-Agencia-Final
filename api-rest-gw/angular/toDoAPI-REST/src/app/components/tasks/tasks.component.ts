  
import { Component, OnInit } from '@angular/core';
 
import { TaskService } from '../../services/task.service';
import { Task } from '../../Task';
 
@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
  providers: [TaskService]
})
 export class TasksComponent implements OnInit {
 tasks: Task[] = [];
 titulo: string = "";

 constructor(private taskService: TaskService) {
 this.taskService.getTasks("reservas")
 .subscribe(tasks => {
  console.log(tasks);
  this.tasks = tasks;
  });
 } 

 ngOnInit() {
 }

 getProveedores(){
   return this.tasks;
 }

 addTask(event: any) {
  //event.preventDefault(); // no queremos que refresque la pantalla
  const newTask:Task = {
    title: this.titulo,
    isDone: false
  };
  this.taskService.addTask(newTask)
  .subscribe(task => {
    this.tasks.push(task);
    this.titulo = '';
  });
 }

 deleteTask(id: string | undefined){
  const response = confirm('¿Estás seguro de que deseas elimiarlo?');
  if(response ){
    const tasks = this.tasks;
    this.taskService.deleteTask(id)
    .subscribe(data => {
      console.log(data.n);
      if(data.n == 1) {
        for(let i = 0; i < tasks.length; i++) {
          if(tasks[i]._id == id) {
            tasks.splice(i, 1);
          }
        }
      }
    });
  }
 }

 updateStatus(task: Task) {
 const newTask = {
  //_id: task._id,
  title: task.title,
  isDone: !task.isDone,
  token: "TMITOKEN123456789"
 };
 this.taskService.updateTask(task._id, newTask)
 .subscribe(res => {
  task.isDone = !task.isDone;
  });
 }
}