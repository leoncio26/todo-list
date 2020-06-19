import { Injectable } from '@angular/core';
import { Database } from '../../models/database';
import { Mode } from 'src/app/models/enums/mode';
import { IndexedDBObject } from 'src/app/models/indexedDBObject';

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

                if(database.mode == Mode.Insert) {
                    if(!db.objectStoreNames.contains(database.storeObject.name)){
                        const objectStore = db.createObjectStore(database.storeObject.name, {keyPath: 'id', autoIncrement: true});
                        objectStore.createIndex('project-info', 'dataCriacao', { unique: false });

                        objectStore.add({dataCriacao: new Date(), dataConclusao: new Date()})
                    }
                    else
                        reject({errorMessage: 'Existe projeto com esse nome.'});
                }
                else if(database.mode == Mode.Edit){
                    db.deleteObjectStore(database.storeObject.oldName);
                    if(!db.objectStoreNames.contains(database.storeObject.name))
                        db.createObjectStore(database.storeObject.name, {keyPath: 'id', autoIncrement: true});
                    else
                        reject({errorMessage: 'Existe projeto com esse nome.'});
                }else{
                    db.deleteObjectStore(database.storeObject.name);
                }
            }

            open.onerror = (event:any) => {
                reject(event);
            }
        });
    }

    getAll(data: IndexedDBObject){
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

    add(data: IndexedDBObject) {
        return new Promise((resolve, reject) => {
            const db = data.database;
            const transaction = db.transaction([data.objectStoreName], 'readwrite');
            const objectStore = transaction.objectStore(data.objectStoreName);
            const request = objectStore.add(data.ObjectStore);
            
            request.onsuccess = (event:any) => {
                resolve(event.target.result)
            }

            request.onerror = event => {
                alert('Ocorreu um erro na inserção')
            }
        })
    }
    
    put(data: IndexedDBObject){
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

    delete(data: IndexedDBObject){
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
}