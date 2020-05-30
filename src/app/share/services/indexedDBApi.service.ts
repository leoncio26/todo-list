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

    clearIndexedDb(){
        

        //const transaction = this.database.transaction('Tasks', 'readwrite');

        //Obtem o objeto criado no database
        //const objectStore = transaction.objectStore('Tasks');

        //const request = objectStore.clear();

        //request.onsuccess = event => {
        //    alert('Limpeza realizada com sucesso');
        //}
    }

    saveDObjectStore(data: SaveObjectStore) {
        const db = data.database;
        const transaction = db.transaction([data.objectStoreName], 'readwrite');
        const objectStore = transaction.objectStore(data.objectStoreName);
        objectStore.add(data.ObjectStore);

        /*const transaction = db.transaction('Tasks', 'readwrite');

        const objectStore = transaction.objectStore('Tasks');

        const request = objectStore.add(task);

        request.onsuccess = event => {
            console.log('Dado gravado com sucesso');

            var item = [];
            task.id = event.target['result'];
            item.push(task);

        }*/
    }
    /*
    getAllIndexedDB() {
        const tasks = [];

        const transaction = this.database.transaction('Tasks');
        const objectStore = transaction.objectStore('Tasks');

        //GetAll é mais performatico
        const request = objectStore.openCursor();

        request.onsuccess = event => {
            const cursor = event.target['result'];

            if(cursor){
                tasks.push(cursor.value);
                console.log('Cursor atual: ' + cursor.value);
                cursor.continue;
            }else{
                console.info('Não existe mais tasks para buscar');
            }
        }
    }

    searchIndexedDB(term) {
        const transaction = this.database.transaction('Tasks');
        const objectStore = transaction.objectStore('Tasks');

        const index = objectStore.index('nome');

        const keyRange = IDBKeyRange.only(term);
    }

    removeIndexedDb(id){
        const transaction = this.database.transaction('Tasks', 'readwrite');
        const objectStore = transaction.objectStore('Tasks');

        const request = objectStore.delete(id);

        request.onsuccess = event => {
            console.log('Item removido com sucesso');
        }
    }*/
}