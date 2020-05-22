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

  constructor(private indexedDBApiService: IndexedDBApiService){}

  ngOnInit():void {
    
  }

  newProject(){
    this.showModal = true;
  }

  addNewProject(event: Project){
    const novoProject: Project = {
      name: event.name,
      dataCriacão: event.dataCriacão || new Date()
    }; 
    const database: Database = {
      name: 'Projects',
      storeObject: [novoProject], 
      version: 3
    };
    this.indexedDBApiService.createIndexedDB(database);
    this.hideModal();
  }

  hideModal(){
    this.showModal = false;
  }
}
