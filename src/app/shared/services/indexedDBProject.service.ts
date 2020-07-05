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

  initializeDB(database: Database): Promise<Project[]>{
    return new Promise((resolve, reject) => {
      this.getAll(database).then(projects => resolve(projects)).catch(e => reject(e));
    })
  }

  getAll(database: Database): Promise<Project[]>{
    return new Promise((resolve, reject) => {
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

  async editStore(database: Database){
    let backupStore = [];
    await this.getTasksByProject(database.objectStore.oldName).then(objects => backupStore = objects);
    await this.post(database).then(() => {
      backupStore.forEach(obj => {
        if(obj.hasOwnProperty('id')) delete obj['id'];
        //this.postTask(database.objectStore.name, obj).then(() => {}).catch(error => alert('Aconteceu um erro no sistema'));
      })
      this.addRange(database.objectStore.name, backupStore);
    });
  }

  addRange(projectName: string, objects: any[]){
    const saveObjectStore: IndexedDBObject = {
      database: this.database,
      objectStoreName: projectName,
    }

    this.indexedDBApiService.addMultiples(saveObjectStore, objects).then(() => {})

    // objects.forEach(obj => {
    //   saveObjectStore.ObjectStore = obj;
    //   this.indexedDBApiService
    //     .add(saveObjectStore)
    //     .then(key => {
    //       console.log(obj);
    //     });
    // })
  }

  getProjectInfo(projectName: string): Promise<Project>{
    return new Promise((resolve, reject) => {
      const indexedDBObject: IndexedDBObject = {
        database: this.database,
        objectStoreName: projectName
      }

      this.indexedDBApiService.getByKey(indexedDBObject, 'project-info', 1).then((project: Project) => {
        resolve(project);
      });
    });
  }
}