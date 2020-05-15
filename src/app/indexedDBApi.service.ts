import { Injectable } from '@angular/core';

@Injectable({providedIn: "root"})
export class IndexedDBApiService {
    private database: IDBDatabase;
    private dbName = 'projects';
    private dbVersion = 2;

    initialize(){
        const open = indexedDB.open(this.dbName, this.dbVersion);

        open.onsuccess = event => {
            this.database = event.target['result'];
            console.log(`Database ${this.database} aberto com sucesso`);

           // this.saveIndexedDB({nome: 'Hello indexedDB!!!'});
           this.clearIndexedDb();
        }

        open.onupgradeneeded = event => {
            const database: IDBDatabase = event.target['result'];

            const objectStore = database.createObjectStore("Tasks", {keyPath: 'id', autoIncrement: true});

            objectStore.createIndex('nome', 'nome', {unique: false});
            objectStore.createIndex('data', 'data', {unique: false});
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