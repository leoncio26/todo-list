import { Component, OnInit } from '@angular/core';
import { IndexedDBApiService } from './shared/services/indexedDBApi.service';
import { Project } from './models/project';
import { Database } from './models/database';
import { Mode } from './models/enums/mode';
import { Task } from './models/task';
import { IndexedDBObject } from './models/indexedDBObject';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'todo';
  tasks: Array<Task> = [];
  showTaskForm: boolean = false;
  selectedTask: any;
  isVisibleAlert: boolean;
  mode: Mode;

  constructor(private indexedDBApiService: IndexedDBApiService){}

  ngOnInit():void {
    this.selectedTask = {name: ''};
  }

  

  newTask(){
    this.showTaskForm = true;
    this.mode = Mode.Insert
  }

  

  saveTask(event: Task) {
    /*const saveObjectStore: IndexedDBObject = {
      database: this.database,
      objectStoreName: this.selectedProjectName,
      ObjectStore: event
    }

    if(this.mode == Mode.Insert){
      this.indexedDBApiService
        .add(saveObjectStore)
        .then(key => {
          event.id = Number(key);
          this.tasks.push(event);
        });
    }else if(this.mode == Mode.Edit){
      this.indexedDBApiService.put(saveObjectStore);
      const searchTaskId = this.tasks.findIndex(t => t.id === event.id);
      this.tasks[searchTaskId] = event;
    }
    
    this.hideForm();
    this.mode = 0;*/
  }

  editTask(event: Task){
    this.showTaskForm = true;
    this.selectedTask = event;
    this.mode = Mode.Edit;
  }

  excluirTask(event: Task){
    this.isVisibleAlert = true;
    this.selectedTask = event;
  }

  deletedTask(){
    /*const indexedDBObject: IndexedDBObject = {
      database: this.database,
      objectStoreName: this.selectedProjectName,
      ObjectStore: this.selectedTask
    }
    this.indexedDBApiService.delete(indexedDBObject)
      .then(r => {
        const id = this.tasks.findIndex(t => t.id == this.selectedTask.id);
        if(id != -1) this.tasks.splice(id, 1);
    });*/
  }

  hideForm(){
    this.showTaskForm = false;
  }
}
