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
  projects: Array<Project> = [];
  tasks: Array<Task> = [];
  showProjectForm: boolean = false;
  showTaskForm: boolean = false;
  database: IDBDatabase;
  selectedProject: Project;
  selectedTask: any;
  oldProjectName: string;
  mode: Mode;
  selectedProjectName: string;
  isVisibleAlert: boolean;

  constructor(private indexedDBApiService: IndexedDBApiService){}

  ngOnInit():void {
    this.selectedProjectName = 'Tarefas do projeto';
    this.selectedProject = {name: ''}
    this.selectedTask = {name: ''};
    const database: Database = {
      name: 'Projects'
    }
    this.indexedDBApiService.openDatabase(database).then((db: IDBDatabase) => {
      this.database = db;

      const projetctsByObjectStoresNames = Array.from(this.database.objectStoreNames);
      
      projetctsByObjectStoresNames.forEach(name => {
        this.projects.push({name});
      });
    })
  }

  newProject(){
    this.showProjectForm = true;
    this.mode = Mode.Insert
  }

  newTask(){
    this.showTaskForm = true;
    this.mode = Mode.Insert
  }

  editProject(event: Project){
    this.selectedProject = event;
    this.oldProjectName = event.name;
    this.showProjectForm = true;
    this.mode = Mode.Edit;
  }

  deleteProject(event: Project){
    this.mode = Mode.Delete;
    this.isVisibleAlert = true;
    this.selectedProject = event;
  }

  deletedProject(){
    this.saveProject(this.selectedProject);
  }

  saveProject(event: Project){
    if(this.mode == Mode.Edit) event.oldName = this.oldProjectName
    const database: Database = {
      name: 'Projects',
      storeObject: event,
      mode: this.mode
    }

    database.version = this.database.version + 1;
    this.database.close();
    
    this.indexedDBApiService.openDatabase(database)
      .then((db:IDBDatabase) => {
        this.database = db;
        if(this.mode == Mode.Insert){
          this.projects.push(event);
        }else if(this.mode == Mode.Edit){
          const deleteNameProjectIndex = this.projects.findIndex(p => p.name == this.oldProjectName);
          if(deleteNameProjectIndex != -1) this.projects[deleteNameProjectIndex].name = event.name;
        }else{
          const deleteNameProjectIndex = this.projects.findIndex(p => p.name == event.name);
          if(deleteNameProjectIndex != -1) this.projects.splice(deleteNameProjectIndex, 1);
        }
      })
      .catch(error => {
        alert(error.errorMessage);
      });
    this.hideForm();
  }

  saveTask(event: Task) {
    const saveObjectStore: IndexedDBObject = {
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
    this.mode = 0;
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
    const indexedDBObject: IndexedDBObject = {
      database: this.database,
      objectStoreName: this.selectedProjectName,
      ObjectStore: this.selectedTask
    }
    this.indexedDBApiService.delete(indexedDBObject)
      .then(r => {
        const id = this.tasks.findIndex(t => t.id == this.selectedTask.id);
        if(id != -1) this.tasks.splice(id, 1);
    });
  }

  showTasksOfProject(event: Project) {
    this.selectedProject = event;
    this.selectedProjectName = event.name;
    const indexedDBObject: IndexedDBObject = {
      database: this.database,
      objectStoreName: this.selectedProjectName
    }

    this.indexedDBApiService.getAll(indexedDBObject).then((tasks: any) => {
      this.tasks = tasks
    });
  }

  hideForm(){
    this.selectedProject = {name: ''};
    this.showProjectForm = false;
    this.showTaskForm = false;
  }
}
