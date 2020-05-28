import { Component, OnInit } from '@angular/core';
import { IndexedDBApiService } from './share/services/indexedDBApi.service';
import { Project } from './models/project';
import { Database } from './models/database';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'todo';
  projects: Array<Project> = [];
  showProjectForm: boolean = false;
  database: IDBDatabase;
  selectedProject: Project;
  isInsert: boolean = false;
  oldProjectName: string;

  constructor(private indexedDBApiService: IndexedDBApiService){}

  ngOnInit():void {
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
    this.isInsert = true;
  }

  saveProject(event: Project){
    if(!this.isInsert) event.oldName = this.oldProjectName
    const database: Database = {
      name: 'Projects',
      storeObject: event
    }

    database.version = this.database.version + 1;
    this.database.close();
    
    this.indexedDBApiService.openDatabase(database)
      .then((db:IDBDatabase) => {
        this.database = db;
        if(!this.isInsert){
          const deleteNameProjectIndex = this.projects.findIndex(p => p.name == this.oldProjectName);
          if(deleteNameProjectIndex != -1) this.projects[deleteNameProjectIndex].name = event.name;
        }else{
          this.projects.push(event);
        }
      })
      .catch(error => {
        alert(error.errorMessage);
      });
    

    /*const novoProject: Project = {
      name: event.name,
      dataCriacão: event.dataCriacão || new Date()
    }; 
    const database: Database = {
      name: 'Projects',
      storesObject: [novoProject], 
      version: 3
    };
    this.indexedDBApiService.createIndexedDB(database);*/
    this.hideModal();
  }

  editProject(event: Project){
    this.selectedProject = event;
    this.oldProjectName = event.name;
    this.showProjectForm = true;
    this.isInsert = false;
  }

  deleteProject(event: Project){
    alert('Será deletado');
  }

  hideModal(){
    this.selectedProject = {name: ''};
    this.showProjectForm = false;
  }
}
