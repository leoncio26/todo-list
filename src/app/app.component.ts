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
    //this.indexedDBApiService.initialize();
    const p1 = <Project>{
      name: 'Primeiro projeto'
    }
    const p2: Project = {
      name: 'Segundo projeto'
    }

    this.projects.push(p1);
    this.projects.push(p2);

    const database: Database = {
      name: 'Projects',
      storeObject: [<Project>{
        name: 'Projeto IndexedDB'
      }]
    };
    this.indexedDBApiService.createIndexedDB(database);
  }

  newProject(){
    this.showModal = true;
  }

  addNewProject(event){
    this.projects.push(event);
    this.hideModal();
  }

  hideModal(){
    this.showModal = false;
  }
}
