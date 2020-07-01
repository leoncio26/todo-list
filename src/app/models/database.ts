import { Index } from '.';

export interface Database{
  name: string;
  storeObject?: any;
  version?: number;
  mode?: number;
  indexes?: Index[];
}