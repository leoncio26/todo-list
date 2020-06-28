import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/models/project';
import { Mode } from 'src/app/models/enums/mode';
import { Database } from 'src/app/models/database';
import { IndexedDBApiService } from 'src/app/shared/services/indexedDBApi.service';
import { IndexedDBObject } from 'src/app/models/indexedDBObject';
import { Task } from 'src/app/models/task';
import { IndexedDBProjectService } from 'src/app/shared/services/indexedDBProject.service';
import { Field } from 'src/app/models/field';

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.css']
})
export class ProjectsListComponent implements OnInit {
  projects: Array<Project> = [];
  showProjectForm: boolean = false;
  selectedProject: Project;
  selectedProjectName: string;
  oldProjectName: string;
  mode: Mode;
  isVisibleAlert: boolean;
  tasks: Array<Task> = [];
  fields: Field[];
  title: string;
  
  constructor(private indexedDBApiService: IndexedDBApiService, private indexedDBProjectService: IndexedDBProjectService) { }

  ngOnInit(): void {
    /*this.selectedProjectName = 'Tarefas do projeto';
    this.selectedProject = {name: ''}
    const database: Database = {
      name: 'Projects'
    }

    this.indexedDBApiService.openDatabase(database).then((db: IDBDatabase) => {
      this.database = db;

      const projetctsByObjectStoresNames = Array.from(this.database.objectStoreNames);
      
      projetctsByObjectStoresNames.forEach(name => {
        this.projects.push({name});
      });
    })*/

    this.selectedProject = {name: ''}
    this.fields = [{
      name: 'name',
      label: 'Nome'
    }]

    this.title = 'Novo projeto';

    this.indexedDBProjectService.getAll('Projects').then(response => {
      this.projects = response})
      .catch((e) => alert(e));
  }

  newProject(): void{
    this.showProjectForm = true;
    this.mode = Mode.Insert
  }

  saveProject(event: Project): void{
    if(this.mode == Mode.Edit) event.oldName = this.oldProjectName
    const database: Database = {
      name: 'Projects',
      storeObject: event,
      mode: this.mode
    }

    /*database.version = this.database.version + 1;
    this.database.close();
    
    this.indexedDBApiService.openDatabase(database)
      .then((db:IDBDatabase) => {
        this.database = db;
        if(this.mode == Mode.Insert){
          this.projects.push(event);
        }else if(this.mode == Mode.Edit){
          const deleteNameProjectIndex = this.projects.findIndex(p => p.name == this.oldProjectName);
          if(deleteNameProjectIndex != -1) this.projects[deleteNameProjectIndex].name = event.name;
        }else{
          const deleteNameProjectIndex = this.projects.findIndex(p => p.name == event.name);
          if(deleteNameProjectIndex != -1) this.projects.splice(deleteNameProjectIndex, 1);
        }
      })
      .catch(error => {
        alert(error.errorMessage);
      });*/

    this.indexedDBProjectService.post(database).then(() => {
      if(this.mode == Mode.Insert){
        this.projects.push(event);
      }else if(this.mode == Mode.Edit){
        const deleteNameProjectIndex = this.projects.findIndex(p => p.name == this.oldProjectName);
        if(deleteNameProjectIndex != -1) this.projects[deleteNameProjectIndex].name = event.name;
      }else{
        const deleteNameProjectIndex = this.projects.findIndex(p => p.name == event.name);
        if(deleteNameProjectIndex != -1) this.projects.splice(deleteNameProjectIndex, 1);
      }
    });
    this.hideForm();
  }

  editProject(event: Project): void{
    this.selectedProject = event;
    this.oldProjectName = event.name;
    this.showProjectForm = true;
    this.mode = Mode.Edit;
  }

  deleteProject(event: Project): void{
    this.mode = Mode.Delete;
    this.isVisibleAlert = true;
    this.selectedProject = event;
  }

  deletedProject(): void{
    this.saveProject(this.selectedProject);
    this.isVisibleAlert = false;
  }

  showTasksOfProject(event: Project): void {
    this.selectedProject = event;
    this.selectedProjectName = event.name;
    /*const indexedDBObject: IndexedDBObject = {
      database: this.database,
      objectStoreName: this.selectedProjectName
    }

    this.indexedDBApiService.getAll(indexedDBObject).then((tasks: any) => {
      this.tasks = tasks;
    });*/

    this.indexedDBProjectService.getTasksByProject(this.selectedProjectName).then(tasks => this.tasks = tasks);
  }

  hideForm(){
    this.selectedProject = {name: ''};
    this.showProjectForm = false;
  }

  onCanceled(){
    this.isVisibleAlert = false;
  }

}
