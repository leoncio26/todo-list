import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Field } from 'src/app/models/field';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  @Input() data: any;
  @Output() save = new EventEmitter();
  @Output() hideForm = new EventEmitter();
  
  title: string;
  fields: Field[];
  constructor() { }

  ngOnInit(): void {
    this.fields = [{
      name: 'name',
      label: 'Nome'
    }]

    this.title = 'Nova tarefa';
  }

  onSubmit(event: any){
    this.save.emit(event);
  }

  onCancel(){
    this.hideForm.emit();
  }
}
