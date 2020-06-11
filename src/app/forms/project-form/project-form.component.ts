import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Project } from 'src/app/models/project';
import { Field } from 'src/app/models/field';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css']
})
export class ProjectFormComponent implements OnInit {
  @Input() mode: string;
  @Input() data: any;

  @Output() hideForm = new EventEmitter();
  @Output() save = new EventEmitter();

  fields: Field[];
  title: string;
  
  constructor() { }

  ngOnInit(): void {
    this.fields = [{
      name: 'name',
      label: 'Nome'
    }]

    this.title = 'Nova tarefa';
  }

  onSubmit(event){
    this.save.emit(event);
  }

  onCancel(){
    this.hideForm.emit(null);
  }

}
