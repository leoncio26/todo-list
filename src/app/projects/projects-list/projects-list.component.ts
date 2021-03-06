import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/models/project';
import { Mode } from 'src/app/models/enums/mode';
import { Database } from 'src/app/models/database';
import { IndexedDBApiService } from 'src/app/shared/services/indexedDBApi.service';
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
  alertMessage: string;
  
  constructor(private indexedDBApiService: IndexedDBApiService, private indexedDBProjectService: IndexedDBProjectService) { }

  ngOnInit(): void {
    this.selectedProject = {name: '', conclusionDate: ''}
    this.fields = [
      {
        name: 'name',
        label: 'Nome'
      },
      {
        name: 'conclusionDate',
        label: 'Data de finalização'
      },
    ]

    this.title = 'Novo projeto';

    const database: Database = {
      name: 'Projects'
    }

    this.indexedDBProjectService.getAll(database).then(projects => {
      this.projects = projects
    }).catch((e) => alert(e));
  }

  newProject(): void{
    this.selectedProject = {name: '', conclusionDate: ''}
    this.showProjectForm = true;
    this.mode = Mode.Insert
  }

  saveProject(event: Project): void{
    if(this.mode == Mode.Edit) event.oldName = this.oldProjectName
    const database: Database = {
      name: 'Projects',
      objectStore: event,
      objectStoreKeyPath: 'id',
      mode: this.mode,
      indexes: [
        {
          name: 'project-info',
          keyPath: 'createDate',
          options: { unique: false }
        },
        {
          name: 'task',
          keyPath: 'name',
          options: { unique: false }
        }
      ]
    }

    if(this.mode === Mode.Edit){
      this.indexedDBProjectService.editStore(database);
      const editedNameProjectIndex = this.projects.findIndex(p => p.name == this.oldProjectName);
      if(editedNameProjectIndex != -1) {
        this.projects[editedNameProjectIndex].name = event.name;
        if(this.selectedProject.name === this.oldProjectName) {
          this.selectedProject.name = event.name;
          this.selectedProjectName = event.name;
        }
      }
    }else{
      this.indexedDBProjectService.post(database).then(() => {
        if(this.mode == Mode.Insert){
          this.projects.push(event);
        }else{
          //deleta projeto
          const deleteNameProjectIndex = this.projects.findIndex(p => p.name == event.name);
          if(deleteNameProjectIndex != -1) {
            this.projects.splice(deleteNameProjectIndex, 1);
            this.selectedProjectName = '';
          }
        }
      });  
    }

    this.hideForm();
  }

  editProject(event: Project): void{
    this.indexedDBProjectService.getProjectInfo(event.name).then(project => {
      this.selectedProject = {
        name: event.name,
        conclusionDate: project.conclusionDate
      };
      this.oldProjectName = event.name;
      this.showProjectForm = true;
      this.mode = Mode.Edit;
    });
    //this.selectedProject = event;
  }

  deleteProject(event: Project): void{
    this.mode = Mode.Delete;
    this.selectedProject = event;
    this.alertMessage = `Você tem certeza que quer excluir o projeto <strong>${this.selectedProject.name}</strong>?`;
    this.isVisibleAlert = true;
  }

  deletedProject(): void{
    this.saveProject(this.selectedProject);
    this.isVisibleAlert = false;
  }

  showTasksOfProject(event: Project): void {
    this.selectedProject = event;
    this.selectedProjectName = event.name;

    this.indexedDBProjectService.getTasksByProject(this.selectedProjectName).then(tasks => this.tasks = tasks);
  }

  hideForm(){
    this.selectedProject = {name: '', conclusionDate: ''};
    this.showProjectForm = false;
  }

  onCanceled(){
    this.isVisibleAlert = false;
  }

}
