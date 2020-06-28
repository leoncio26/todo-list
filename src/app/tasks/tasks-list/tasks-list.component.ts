import { Component, OnInit, Input } from '@angular/core';
import { Task } from 'src/app/models/task';
import { Mode } from 'src/app/models/enums/mode';
import { Field } from 'src/app/models/field';
import { IndexedDBProjectService } from 'src/app/shared/services/indexedDBProject.service';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.css']
})
export class TasksListComponent implements OnInit {
  @Input() tasks: Array<Task> = [];
  @Input() selectedProjectName: string;

  showTaskForm: boolean = false;
  selectedTask: any;
  mode: Mode;
  isVisibleAlert: boolean;
  title: string;
  fields: Field[];
  
  constructor(private indexedDBProjectService: IndexedDBProjectService) { }

  ngOnInit(): void {
    this.title = 'Nova tarefa';
    this.fields = [{
      name: 'name',
      label: 'Nome'
    }]
    this.selectedTask = {name: ''};
  }

  newTask(): void{
    this.showTaskForm = true;
    this.mode = Mode.Insert
    this.selectedTask = {name: ''};
  }

  saveTask(event: Task) {
    /*const saveObjectStore: IndexedDBObject = {
      database: this.database,
      objectStoreName: this.selectedProjectName,
      ObjectStore: event
    }*/

    if(this.mode == Mode.Insert){
      /*this.indexedDBApiService
        .add(saveObjectStore)
        .then(key => {
          event.id = Number(key);
          this.tasks.push(event);
        });*/
      this.indexedDBProjectService.postTask(this.selectedProjectName, event).then(task => this.tasks.push(task));
    }else if(this.mode == Mode.Edit){
      /*this.indexedDBApiService.put(saveObjectStore);
      const searchTaskId = this.tasks.findIndex(t => t.id === event.id);
      this.tasks[searchTaskId] = event;*/
      this.indexedDBProjectService.putTask(this.selectedProjectName, event);
      const searchTaskId = this.tasks.findIndex(t => t.id === event.id);
      this.tasks[searchTaskId] = event;
    }
    
    this.hideForm();
    this.mode = 0;
  }

  editTask(event: Task){
    this.showTaskForm = true;
    this.selectedTask = event;
    this.mode = Mode.Edit;
  }

  excluirTask(event: Task){
    this.isVisibleAlert = true;
    this.selectedTask = event;
  }

  deletedTask(){
    /*const indexedDBObject: IndexedDBObject = {
      database: this.database,
      objectStoreName: this.selectedProjectName,
      ObjectStore: this.selectedTask
    }
    this.indexedDBApiService.delete(indexedDBObject)
      .then(r => {
        const id = this.tasks.findIndex(t => t.id == this.selectedTask.id);
        if(id != -1) this.tasks.splice(id, 1);
    });*/
    this.indexedDBProjectService.deleteTask(this.selectedProjectName, this.selectedTask).then(r => {
      const id = this.tasks.findIndex(t => t.id == this.selectedTask.id);
      if(id != -1) this.tasks.splice(id, 1);
    })
    this.isVisibleAlert = false;
  }

  hideForm(){
    this.showTaskForm = false;
  }

  onCanceled(){
    this.isVisibleAlert = false;
  }
}
