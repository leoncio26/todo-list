import { Component, OnInit } from '@angular/core';
import { IndexedDBApiService } from './share/services/indexedDBApi.service';
import { Project } from './models/project';
import { Database } from './models/database';
import { DatabaseMode } from './models/enums/database-mode';
import { Task } from './models/task';
import { SaveObjectStore } from './models/objectStore';

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
  databaseMode: DatabaseMode;
  selectedProjectName: string;

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
    this.databaseMode = DatabaseMode.Insert
  }

  newTask(){
    this.showTaskForm = true;
    this.databaseMode = DatabaseMode.Insert
  }

  editProject(event: Project){
    this.selectedProject = event;
    this.oldProjectName = event.name;
    this.showProjectForm = true;
    this.databaseMode = DatabaseMode.Edit;
  }

  deleteProject(event: Project){
    this.databaseMode = DatabaseMode.Delete;
    this.saveProject(event);
  }

  saveProject(event: Project){
    if(this.databaseMode == DatabaseMode.Edit) event.oldName = this.oldProjectName
    const database: Database = {
      name: 'Projects',
      storeObject: event,
      mode: this.databaseMode
    }

    database.version = this.database.version + 1;
    this.database.close();
    
    this.indexedDBApiService.openDatabase(database)
      .then((db:IDBDatabase) => {
        this.database = db;
        if(this.databaseMode == DatabaseMode.Insert){
          this.projects.push(event);
        }else if(this.databaseMode == DatabaseMode.Edit){
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
    const saveObjectStore: SaveObjectStore = {
      database: this.database,
      objectStoreName: this.selectedProjectName,
      ObjectStore: event
    }

    if(this.databaseMode == DatabaseMode.Insert){
      this.indexedDBApiService.saveObjectStore(saveObjectStore);
      this.tasks.push(event);
    }else if(this.databaseMode == DatabaseMode.Edit){
      this.indexedDBApiService.edit(saveObjectStore);
      const searchTaskId = this.tasks.findIndex(t => t.id === event.id);
      this.tasks[searchTaskId] = event;
    }
    
    this.hideForm();
    this.databaseMode = 0;
  }

  editTask(event: Task){
    this.showTaskForm = true;
    this.selectedTask = event;
    this.databaseMode = DatabaseMode.Edit;
  }

  excluirTask(event: Task){
    const saveObjectStore: SaveObjectStore = {
      database: this.database,
      objectStoreName: this.selectedProjectName,
      ObjectStore: event
    }
    this.indexedDBApiService.delete(saveObjectStore)
      .then(r => {
        const id = this.tasks.findIndex(t => t.id == event.id);
        if(id != -1) this.tasks.splice(id, 1);
      });
  }

  showTasksOfProject(event: Project) {
    this.selectedProject = event;
    this.selectedProjectName = event.name;
    const saveObjectStore: SaveObjectStore = {
      database: this.database,
      objectStoreName: this.selectedProjectName
    }

    this.indexedDBApiService.getAll(saveObjectStore).then((tasks: any) => {
      this.tasks = tasks
    });
  }

  hideForm(){
    this.selectedProject = {name: ''};
    this.showProjectForm = false;
    this.showTaskForm = false;
  }
}
