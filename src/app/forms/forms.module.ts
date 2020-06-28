import { NgModule } from "@angular/core";
import { BasicformComponent } from './basic-form/basic-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [BasicformComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [BasicformComponent]
})
export class FormsModule{}