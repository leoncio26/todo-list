export interface IndexedDBObject{
  database: IDBDatabase;
  objectStoreName: string;
  ObjectStore?: any;
}