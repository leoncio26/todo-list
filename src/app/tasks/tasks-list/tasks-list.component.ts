import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Task } from 'src/app/models/task';
import { Mode } from 'src/app/models/enums/mode';
import { Field } from 'src/app/models/field';
import { IndexedDBProjectService } from 'src/app/shared/services/indexedDBProject.service';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.css']
})
export class TasksListComponent implements OnInit, OnChanges {
  @Input() tasks: Task[];
  @Input() selectedProjectName: string;

  showTaskForm: boolean = false;
  selectedTask: any;
  mode: Mode;
  isVisibleAlert: boolean;
  title: string;
  fields: Field[];

  tasksAFazer: Task[] = [];
  tasksConcluidas: Task[] = [];
  
  constructor(private indexedDBProjectService: IndexedDBProjectService) { }
  
  ngOnChanges(changes: SimpleChanges): void {
    this.groupTasks();
  }

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
    if(event.status === undefined) event.status = false;
    if(this.mode == Mode.Insert){
      this.indexedDBProjectService.postTask(this.selectedProjectName, event).then(task => {
        this.tasks.push(task);
        this.groupTasks();
      });
    }else if(this.mode == Mode.Edit){
      this.indexedDBProjectService.putTask(this.selectedProjectName, event);
      const searchTaskId = this.tasks.findIndex(t => t.id === event.id);
      this.tasks[searchTaskId] = event;
      this.groupTasks();
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
      if(id != -1) {
        this.tasks.splice(id, 1);
        this.groupTasks();
      }
    })
    this.isVisibleAlert = false;
  }

  hideForm(){
    this.showTaskForm = false;
  }

  onCanceled(){
    this.isVisibleAlert = false;
  }

  changeTaskStatus(event: Task){
    event.status = !event.status;
    this.mode = Mode.Edit;
    this.saveTask(event);
  }

  groupTasks(){
    this.tasksAFazer = [];
    this.tasksConcluidas = [];
    this.tasks.forEach(task => {
      if(task.status){
        this.tasksConcluidas.push(task);
      }else{
        this.tasksAFazer.push(task);
      }
    })
  }
}
