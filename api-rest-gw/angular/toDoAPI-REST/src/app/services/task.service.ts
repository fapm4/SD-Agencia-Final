import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Task } from '../Task';


@Injectable()
export class TaskService {
  quePuerto = 3001;
  queIp = "localhost";

  apiRest = `https://${this.queIp}:${this.quePuerto}/api`;

  constructor(private http: HttpClient) { }

  getTasks(dir: string){
    if(dir != null){
      this.apiRest += `/${dir}`;
    }
    return this.http.get<Task[]>(`${this.apiRest}`)
          .pipe(map (res => res));
  }

  addTask(newTask: Task){
    return this.http.post<Task>(`${this.apiRest}`, newTask)
          .pipe(map (res => res));
  }

  deleteTask(id: any){
    return this.http.delete<any>(`${this.apiRest}/${id}`)
          .pipe(map (res => res));
  }

  updateTask(id: any, newTaskData: Task){
    return this.http.put<any> (`${this.apiRest}/${id}`, newTaskData)
          .pipe(map (res => res));
  }
}