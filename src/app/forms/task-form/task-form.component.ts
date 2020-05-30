import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Task } from 'src/app/models/task';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  form: FormGroup;
  @Output() save = new EventEmitter();
  @Output() hideForm = new EventEmitter();
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ''
    });
  }

  onSubmit(event: Task){
    this.save.emit(event);
    this.form.reset();
  }

  onCancel(event){
    event.preventDefault();
    this.hideForm.emit();
  }
}
