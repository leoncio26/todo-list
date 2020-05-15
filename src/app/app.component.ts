import { Component, OnInit } from '@angular/core';
import { IndexedDBApiService } from './indexedDBApi.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'todo';

  constructor(private indexedDBApiService: IndexedDBApiService){}

  ngOnInit():void {
    this.indexedDBApiService.initialize();
  }
}
