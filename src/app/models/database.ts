import { Index } from '.';

export interface Database{
  name: string;
  objectStore?: any;
  version?: number;
  mode?: number;
  indexes?: Index[];
  objectStoreKeyPath?: any;
}