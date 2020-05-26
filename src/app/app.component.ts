import { Component, OnInit } from '@angular/core';
import { IndexedDBApiService } from './indexedDBApi.service';
import { Project } from './project';
import { Database } from './database';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'todo';
  projects: Array<Project> = [];
  showModal: boolean = false;
  database: IDBDatabase;

  constructor(private indexedDBApiService: IndexedDBApiService){}

  ngOnInit():void {
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
    this.showModal = true;
  }

  addNewProject(event: Project){
    const database: Database = {
      name: 'Projects',
      storeObject: event
    }

    database.version = this.database.version + 1;
    this.database.close();
    
    this.indexedDBApiService.openDatabase(database).then((db:IDBDatabase) => {
      this.database = db;
      this.projects.push(event);
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

  hideModal(){
    this.showModal = false;
  }
}
