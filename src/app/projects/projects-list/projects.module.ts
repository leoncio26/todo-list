import { NgModule } from "@angular/core";
import { ProjectsListComponent } from './projects-list.component';
import { IndexedDBProjectService } from 'src/app/shared/services/indexedDBProject.service';
import { IconsModule } from 'src/app/shared/icons/icons.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from 'src/app/forms/forms.module';

@NgModule({
  declarations: [ProjectsListComponent],
  imports: [
    CommonModule,
    IconsModule,
    FormsModule
  ],
  exports: [ProjectsListComponent],
  providers: [IndexedDBProjectService]
})
export class ProjectsModule{ }