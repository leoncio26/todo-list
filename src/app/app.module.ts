import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ProjectFormComponent } from './forms/project-form/project-form.component';
import { TaskFormComponent } from './forms/task-form/task-form.component';
import { BasicformComponent } from './forms/basic-form/basic-form.component';
import { IconsModule } from './shared/icons/icons.module';

@NgModule({
  declarations: [
    AppComponent,
    ProjectFormComponent,
    TaskFormComponent,
    BasicformComponent
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    IconsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
