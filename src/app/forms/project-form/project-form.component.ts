import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Project } from 'src/app/models/project';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css']
})
export class ProjectFormComponent implements OnInit {
  @Input() selectedProject: Project;
  @Input() mode: string;

  @Output() hideModal = new EventEmitter();
  @Output() save = new EventEmitter();

  form: FormGroup;
  
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [this.selectedProject.name]
    });
  }

  onSubmit(event){
    this.save.emit(event);
    this.form.reset();
  }

  onCancel(event){
    event.preventDefault();
    this.form.reset();
    this.hideModal.emit(null);
  }

}
