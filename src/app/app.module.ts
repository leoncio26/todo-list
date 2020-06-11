import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ProjectFormComponent } from './forms/project-form/project-form.component';
import { TaskFormComponent } from './forms/task-form/task-form.component';
import { BasicformComponent } from './forms/basic-form/basic-form.component';

@NgModule({
  declarations: [
    AppComponent,
    ProjectFormComponent,
    TaskFormComponent,
    BasicformComponent
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
