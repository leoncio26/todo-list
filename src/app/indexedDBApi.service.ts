import { Injectable } from '@angular/core';
import { Database } from './database';

@Injectable({providedIn: "root"})
export class IndexedDBApiService {
    private database: IDBDatabase;

    createIndexedDB(database: Database){
        const db = indexedDB.open(database.name);

        db.onsuccess = (event:any) => {
            this.database = event.target.result;
        }

        db.onerror = event => {
            alert(event.target['errorCode']);
        }

        db.onupgradeneeded = event => {
            const db: IDBDatabase = event.target['result'];

            database.storeObject.forEach(obj => {
                const objectStore = db.createObjectStore(obj.name, {keyPath: 'id', autoIncrement: true});  
            })

            
            //objectStore.createIndex('data', 'data', {unique: false});
        }
    }

    clearIndexedDb(){
        const transaction = this.database.transaction('Tasks', 'readwrite');

        //Obtem o objeto criado no database
        const objectStore = transaction.objectStore('Tasks');

        const request = objectStore.clear();

        request.onsuccess = event => {
            alert('Limpeza realizada com sucesso');
        }
    }

    saveIndexedDB(task) {
        const transaction = this.database.transaction('Tasks', 'readwrite');

        const objectStore = transaction.objectStore('Tasks');

        const request = objectStore.add(task);

        request.onsuccess = event => {
            console.log('Dado gravado com sucesso');

            var item = [];
            task.id = event.target['result'];
            item.push(task);

        }
    }

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
    }
}