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
  
  isVisibleAlert: boolean;
  mode: Mode;

  constructor(private indexedDBApiService: IndexedDBApiService){}

  ngOnInit():void {
    
  }

  /*

  

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

  */
}
