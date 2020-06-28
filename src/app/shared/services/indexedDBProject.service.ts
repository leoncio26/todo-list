import { Injectable } from "@angular/core";
import { IndexedDBApiService } from './indexedDBApi.service';
import { Project } from 'src/app/models/project';
import { Database } from 'src/app/models/database';
import { Mode } from 'src/app/models/enums/mode';

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
}