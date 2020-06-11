import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Field } from 'src/app/models/field';

@Component({
  selector: 'app-basic-form',
  templateUrl: './basic-form.component.html',
  styleUrls: ['./basic-form.component.css']
})
export class BasicformComponent implements OnInit {
  @Input() fields: Field[];
  @Input() title: string;
  @Input() data: any;

  @Output() onCanceled: EventEmitter<any> = new EventEmitter();
  @Output() onSave: EventEmitter<any> = new EventEmitter();

  form: FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group(this.data);
  }

  onCancel($event){
    event.preventDefault();
    this.onCanceled.emit();
  }

  onSubmit(form){
    this.onSave.emit(form);
    this.form.reset();
  }

}
