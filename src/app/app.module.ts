import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { IconsModule } from './shared/icons/icons.module';
import { AlertComponent } from './shared/components/alert/alert.component';
import { ProjectsModule } from './projects/projects-list/projects.module';
import { FormsModule } from './forms/forms.module';

@NgModule({
  declarations: [
    AppComponent,
    AlertComponent
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    IconsModule,
    FormsModule,
    ProjectsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
