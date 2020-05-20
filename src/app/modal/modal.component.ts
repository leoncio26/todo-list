import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  form: FormGroup;

  @Output() hideModal = new EventEmitter();
  @Output() save = new EventEmitter();
  
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['']
    });
  }

  onSubmit(event){
    this.save.emit(event);
  }

  onCancel(event){
    event.preventDefault();
    this.hideModal.emit(null);
  }

}
