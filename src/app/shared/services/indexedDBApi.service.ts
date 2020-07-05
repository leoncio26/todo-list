import { Injectable } from '@angular/core';
import { Database } from '../../models/database';
import { Mode } from 'src/app/models/enums/mode';
import { IndexedDBObject } from 'src/app/models/indexedDBObject';
import { Index } from 'src/app/models';

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
                
                //if(!database.storeObject.name) return;

                if(database.mode == Mode.Insert) {
                    if(!db.objectStoreNames.contains(database.objectStore.name)){
                        const objectStore = db.createObjectStore(database.objectStore.name, {keyPath: database.objectStoreKeyPath, autoIncrement: true});

                        if(database.indexes){
                            if(database.indexes.length){
                                database.indexes.forEach((index: Index) => {
                                    objectStore.createIndex(index.name, index.keyPath, index.options);
                                })
                            }
                        }

                        objectStore.add(
                            {
                                createDate: new Date(), 
                                conclusionDate: database.objectStore.conclusionDate ? database.objectStore.conclusionDate : new Date()
                            });
                    }
                    else
                        reject({errorMessage: 'Existe projeto com esse nome.'});
                }
                else if(database.mode == Mode.Edit){
                    db.deleteObjectStore(database.objectStore.oldName);
                    if(!db.objectStoreNames.contains(database.objectStore.name)){
                        const objectStore = db.createObjectStore(database.objectStore.name, {keyPath: database.objectStoreKeyPath, autoIncrement: true});

                        if(database.indexes){
                            if(database.indexes.length){
                                database.indexes.forEach((index: Index) => {
                                    objectStore.createIndex(index.name, index.keyPath, index.options);
                                })
                            }
                        }

                        /*objectStore.add(
                            {
                                createDate: new Date(), 
                                conclusionDate: database.objectStore.conclusionDate ? database.objectStore.conclusionDate : new Date()
                            });*/
                    }else
                        reject({errorMessage: 'Existe projeto com esse nome.'});
                }else{
                    db.deleteObjectStore(database.objectStore.name);
                }
            }

            open.onerror = (event:any) => {
                reject(event);
            }
        });
    }

    getAll(data: IndexedDBObject):Promise<any[]>{
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

    getAllByIndex(data: IndexedDBObject, indexName: string): Promise<any>{
        return new Promise((resolve, reject) => {
            let response = [];
            const db = data.database;
            const transaction = db.transaction(data.objectStoreName);
            const objectStore = transaction.objectStore(data.objectStoreName);
            const index = objectStore.index(indexName);
            const openCursor = index.openCursor();

            openCursor.onsuccess = (event: any) => {
                const cursor = event.target.result;
                if(cursor){
                    response.push(cursor.value);
                    cursor.continue();
                }
                resolve(response);
            }

            openCursor.onerror = (error: any) => reject(error);
        })
    }

    getByKey(data: IndexedDBObject, indexName: string, key: any){
        return new Promise((resolve, reject) => {
            const db = data.database;
            const transaction = db.transaction(data.objectStoreName);
            const objectStore = transaction.objectStore(data.objectStoreName);
            const request = objectStore.get(key);

            request.onsuccess = (event: any) => {
                resolve(event.target.result);
            }

            request.onerror = error => reject(error);
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

    addMultiples(data: IndexedDBObject, objects: any[]){
        return new Promise((resolve, reject) => {
            const db = data.database;
            const transaction = db.transaction([data.objectStoreName], 'readwrite');
            const objectStore = transaction.objectStore(data.objectStoreName);
            
            objects.forEach(obj => {
                const request = objectStore.add(obj);
            })

            transaction.oncomplete = () => {}
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