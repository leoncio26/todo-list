import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';

import { TasksListComponent } from './tasks-list/tasks-list.component';
import { IconsModule } from '../shared/icons/icons.module';
import { FormsModule } from '../forms/forms.module';

@NgModule({
  declarations: [TasksListComponent],
  imports: [
    CommonModule,
    IconsModule,
    FormsModule,
  ],
    exports: [TasksListComponent]
})
export class TasksModule{}