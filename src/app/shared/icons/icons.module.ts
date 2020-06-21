import { NgModule } from '@angular/core';
 
import { FeatherModule } from 'angular-feather';
import { Edit2, Trash2, Plus } from 'angular-feather/icons';
 
// Select some icons (use an object, not an array)
const icons = {
  Edit2,
  Trash2,
  Plus 
};
 
@NgModule({
  imports: [
    FeatherModule.pick(icons)
  ],
  exports: [
    FeatherModule
  ]
})
export class IconsModule { }