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
  oldProjectName: string;
  databaseMode: DatabaseMode;
  selectedProjectName: string;

  constructor(private indexedDBApiService: IndexedDBApiService){}

  ngOnInit():void {
    this.selectedProjectName = 'Tarefas do projeto';
    this.selectedProject = {name: ''}
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
    this.indexedDBApiService.saveDObjectStore(saveObjectStore);
    this.tasks.push(event);
    this.hideForm();
  }

  showTasksOfProject(event: Project) {
    this.selectedProject = event;
    this.selectedProjectName = event.name;
  }

  hideForm(){
    this.selectedProject = {name: ''};
    this.showProjectForm = false;
    this.showTaskForm = false;
  }
}
