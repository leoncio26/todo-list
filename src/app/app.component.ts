import { Component, OnInit } from '@angular/core';
import { IndexedDBApiService } from './indexedDBApi.service';
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
  formMode: string;

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
    this.formMode = 'inserir';
    this.showProjectForm = true;
  }

  addNewProject(event: Project){
    const database: Database = {
      name: 'Projects',
      storeObject: event
    }

    database.version = this.database.version + 1;
    this.database.close();
    
    this.indexedDBApiService.openDatabase(database)
      .then((db:IDBDatabase) => {
        this.database = db;
        this.projects.push(event);
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
    this.formMode = 'editar'
    this.selectedProject = event;
    this.showProjectForm = true;
  }

  hideModal(){
    this.selectedProject = {name: ''};
    this.showProjectForm = false;
  }
}
