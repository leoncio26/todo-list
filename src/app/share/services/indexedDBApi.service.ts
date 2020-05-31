import { Injectable } from '@angular/core';
import { Database } from '../../models/database';
import { DatabaseMode } from 'src/app/models/enums/database-mode';
import { SaveObjectStore } from 'src/app/models/objectStore';

@Injectable({providedIn: "root"})
export class IndexedDBApiService {

    async openDatabase(database: Database){
        return new Promise((resolve, reject) => {
            const open = indexedDB.open(database.name, database.version);
            open.onsuccess = (event: any) => {
                resolve(<IDBDatabase>event.target.result);
            }

            open.onupgradeneeded = (event: any) => {
                const db: IDBDatabase = event.target.result;
                
                if(!database.storeObject.name) return;

                if(database.mode == DatabaseMode.Insert) {
                    if(!db.objectStoreNames.contains(database.storeObject.name))
                        db.createObjectStore(database.storeObject.name, {keyPath: 'id', autoIncrement: true});
                    else
                        reject({errorMessage: 'Existe projeto com esse nome.'});
                }
                else if(database.mode == DatabaseMode.Edit){
                    db.deleteObjectStore(database.storeObject.oldName);
                    if(!db.objectStoreNames.contains(database.storeObject.name))
                        db.createObjectStore(database.storeObject.name, {keyPath: 'id', autoIncrement: true});
                    else
                        reject({errorMessage: 'Existe projeto com esse nome.'});
                }else{
                    db.deleteObjectStore(database.storeObject.name);
                }

                /*database.storesObject.forEach(obj => {
                    const objectStore = db.createObjectStore(obj.name, {keyPath: 'id', autoIncrement: true});  
    
                    const request = objectStore.add(obj);
                })*/
            }

            open.onerror = (event:any) => {
                reject(event);
            }
        });
    }

    getAll(data: SaveObjectStore){
        return new Promise((resolve, reject) => {
            const db = data.database;
            const transaction = db.transaction(data.objectStoreName);
            const objectStore = transaction.objectStore(data.objectStoreName);
            const request = objectStore.getAll();

            request.onsuccess = (event: any) => {
                resolve(event.target.result);
            }

            request.onerror = (event: any) => {
                reject(event.error);
            }
        })
    }

    saveObjectStore(data: SaveObjectStore) {
        const db = data.database;
        const transaction = db.transaction([data.objectStoreName], 'readwrite');
        const objectStore = transaction.objectStore(data.objectStoreName);
        objectStore.add(data.ObjectStore);
    }
    
    edit(data: SaveObjectStore){
        return new Promise((resolve, reject) => {
            const db = data.database;
            const transaction = db.transaction([data.objectStoreName], 'readwrite');
            const objectStore = transaction.objectStore(data.objectStoreName);
            const request = objectStore.put(data.ObjectStore);

            request.onsuccess = (event:any) => {
                resolve(event.target.result);
            }
        })
    }

    delete(data: SaveObjectStore){
        return new Promise((resolve, reject) => {
            const db = data.database;
            const transaction = db.transaction([data.objectStoreName], 'readwrite');
            const objectStore = transaction.objectStore(data.objectStoreName);
            const request = objectStore.delete(data.ObjectStore.id);

            request.onsuccess = (event: any) => {
                resolve(event.target.result);
            }
        });
    }

    clearIndexedDb(){
        

        //const transaction = this.database.transaction('Tasks', 'readwrite');

        //Obtem o objeto criado no database
        //const objectStore = transaction.objectStore('Tasks');

        //const request = objectStore.clear();

        //request.onsuccess = event => {
        //    alert('Limpeza realizada com sucesso');
        //}
    }
}