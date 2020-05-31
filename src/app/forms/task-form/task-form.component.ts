import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Task } from 'src/app/models/task';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  @Input() selectedTask: Task;

  @Output() save = new EventEmitter();
  @Output() hideForm = new EventEmitter();
  
  form: FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [this.selectedTask.name]
    });
  }

  onSubmit(event: Task){
    this.selectedTask.name = event.name;
    this.save.emit(this.selectedTask);
    this.form.reset();
  }

  onCancel(event){
    event.preventDefault();
    this.hideForm.emit();
  }
}
