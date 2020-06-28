import { Injectable } from "@angular/core";
import { IndexedDBApiService } from './indexedDBApi.service';
import { Project } from 'src/app/models/project';
import { Database } from 'src/app/models/database';
import { Mode } from 'src/app/models/enums/mode';
import { Task } from 'src/app/models/task';
import { IndexedDBObject } from 'src/app/models/indexedDBObject';

@Injectable()
export class IndexedDBProjectService{
  database: IDBDatabase;
  constructor(private indexedDBApiService: IndexedDBApiService){}

  getAll(databaseName: string): Promise<Project[]>{
    return new Promise((resolve, reject) => {
      const database: Database = {
        name: databaseName
      }
      this.indexedDBApiService.openDatabase(database).then((db: IDBDatabase) => {
        this.database = db;
  
        const projetctsByObjectStoresNames = Array.from(this.database.objectStoreNames);
        let projects: Project[] = [];
  
        projetctsByObjectStoresNames.forEach(name => {
          projects.push({name});
        });
  
        resolve(projects);
      }).catch(e => reject(e));
    })
  }

  getTasksByProject(projectName: string): Promise<Task[]>{
    return new Promise((resolve, reject) => {
      const indexedDBObject: IndexedDBObject = {
        database: this.database,
        objectStoreName: projectName
      }

      this.indexedDBApiService.getAll(indexedDBObject).then((tasks: any) => {
        resolve(tasks);
      });
    });
  }

  post(database: Database): Promise<Project[]>{
    return new Promise((resolve, reject) => {
      database.version = this.database.version + 1;
      this.database.close();

      this.indexedDBApiService.openDatabase(database)
        .then((db:IDBDatabase) => {
          this.database = db;
          resolve(null);
        })
        .catch(error => {
          alert(error.errorMessage);
        });
      })
  }

  postTask(projectName: string, task: Task): Promise<Task>{
    const saveObjectStore: IndexedDBObject = {
      database: this.database,
      objectStoreName: projectName,
      ObjectStore: task
    }
    return new Promise((resolve, reject) => {
      this.indexedDBApiService
        .add(saveObjectStore)
        .then(key => {
          task.id = Number(key);
          resolve(task);
        });
    })
  }

  putTask(projectName: string, task: Task): void{
    const saveObjectStore: IndexedDBObject = {
      database: this.database,
      objectStoreName: projectName,
      ObjectStore: task
    }
    this.indexedDBApiService.put(saveObjectStore);
  }

  deleteTask(projectName: string, task: Task): Promise<any>{
    const indexedDBObject: IndexedDBObject = {
      database: this.database,
      objectStoreName: projectName,
      ObjectStore: task
    }

    return new Promise((resolve, reject) => {
      this.indexedDBApiService.delete(indexedDBObject)
      .then(r => {
        resolve(r);
      });
    })
  }
}