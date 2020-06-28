import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ProjectFormComponent } from './forms/project-form/project-form.component';
import { TaskFormComponent } from './forms/task-form/task-form.component';
import { IconsModule } from './shared/icons/icons.module';
import { AlertComponent } from './shared/components/alert/alert.component';
import { ProjectsModule } from './projects/projects-list/projects.module';

@NgModule({
  declarations: [
    AppComponent,
    TaskFormComponent,
    AlertComponent
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    IconsModule,
    ProjectsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
