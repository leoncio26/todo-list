import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {
  @Input() title: string;
  @Input() message: string;
  @Input() confirmButton: boolean = true;
  @Input() cancelButton: boolean;
  @Input() confirmButtonText: string = 'ok';
  @Input() cancelButtonText: string;
  @Input() isVisible: boolean;

  @Output() onConfirmed = new EventEmitter();
  @Output() onCanceled = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

  onConfirm(){
    this.onConfirmed.emit();
  }

  onCancel(){
    this.onCanceled.emit();
  }

}
