import { Injectable } from '@angular/core';
import { Database } from './database';

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
                
                db.createObjectStore(database.storeObject.name);

                /*database.storesObject.forEach(obj => {
                    const objectStore = db.createObjectStore(obj.name, {keyPath: 'id', autoIncrement: true});  
    
                    const request = objectStore.add(obj);
                })*/
            }

            open.onerror = (event:any) => {
                return event;
            }
        });
    }

    createStoreObject(database: IDBDatabase, name: string){
        database.createObjectStore(name);

        /*const db = indexedDB.open(database.name, database.version);

        db.onsuccess = (event:any) => {
            const d:IDBDatabase = event.target.result;
            console.log(d.objectStoreNames);
        }

        db.onerror = event => {
            alert(event.target['errorCode']);
        }

        db.onupgradeneeded = event => {
            const db: IDBDatabase = event.target['result'];

            database.storesObject.forEach(obj => {
                const objectStore = db.createObjectStore(obj.name, {keyPath: 'id', autoIncrement: true});  

                const request = objectStore.add(obj);
            })

            
            //objectStore.createIndex('data', 'data', {unique: false});
        }*/
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

    saveIndexedDB(newData) {
        const db = indexedDB.open('Projects');

        db.onsuccess = (event: any) => {
            const result = event.target.result;
            const transaction = result.transaction([newData.name], 'readwrite')

            const objectStore = transaction.objectStore(newData.name);
            const request = objectStore.add(newData);
        }

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