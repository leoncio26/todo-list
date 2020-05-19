import { Component, OnInit } from '@angular/core';
import { IndexedDBApiService } from './indexedDBApi.service';
import { Project } from './project';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'todo';
  projects: Array<Project> = [];

  constructor(private indexedDBApiService: IndexedDBApiService){}

  ngOnInit():void {
    //this.indexedDBApiService.initialize();
    const p1 = <Project>{
      name: 'Primeiro projeto',
      date: new Date()
    }
    const p2: Project = {
      name: 'Segundo projeto',
      date: new Date()
    }

    this.projects.push(p1);
    this.projects.push(p2);
  }

  newProject(){
    alert('Novo projeto');
  }
}
