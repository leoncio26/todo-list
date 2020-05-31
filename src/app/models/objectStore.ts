export interface SaveObjectStore{
  database: IDBDatabase;
  objectStoreName: string;
  ObjectStore?: any;
}