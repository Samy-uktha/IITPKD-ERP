import { Component, } from '@angular/core';
import { DataServiceService } from '../data-service.service';
import { pdf, Project, Status } from '../models';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgbNav, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { PurchaseDetailComponent } from "../purchase-detail/purchase-detail.component";
import { PreviewComponent } from "../preview/preview.component";
import { TablesComponent } from "../tables/tables.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HttpClientModule, CommonModule, NgbNavModule, PurchaseDetailComponent, PreviewComponent, TablesComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  providers : [DataServiceService]
})
export class HomeComponent {
  display : boolean = false;
  activetab : number = 0;
  projects : Project[] = [];
  displaytables : boolean = true;
  

  selectedProject : Project = {} as Project;

  pr_stat = ["Pending", "Forwarded to vendor", "Recieved", "Rejected", "Approved", "Sent back"];

  disp_stat = ["Pending", "Rejected", "Approved"];
  // proj_stat: { [key: string]: string[] } = {};

  proj_stat: { [key: string]: Project[] } = {
    "Pending": [],
    "Rejected": [],
    "Approved": [],
  };
  comment:string = "";


  constructor(private dataservice : DataServiceService){}

  ngOnInit() : void{
    this.getData();
    for (let stat of this.disp_stat){
      this.proj_stat[stat] = [];
    }
  }

  filterResults(text : string){
    for (let stat of this.disp_stat){
      if (stat.toLowerCase().includes(text.toLowerCase())){
        this.setActiveTab(stat);
      }
    }
  }


  getData(){
    this.dataservice.getprojects().subscribe(
      {
        next : data => {
          this.projects = data;
          this.projectstatsep();
          console.log(data);
        }
      },
  
    );
  }

  projectstatsep(){
    for (let stat of this.disp_stat){
      this.proj_stat[stat] = [];
    }
    for (let project of this.projects){
      switch(project.status.status ){
        case Status.RECIEVED:
          // this.proj_stat["Recieved"].push(project);
          this.proj_stat["Approved"].push(project);
          break;
        case Status.REJECTED:
          this.proj_stat["Rejected"].push(project);
          break;
        case Status.APPROVED:
            this.proj_stat["Approved"].push(project);
            break;
        case Status.CLARIFICATION:
              // this.proj_stat["Sent back"].push(project);
              this.proj_stat["Pending"].push(project);
              break;
        case Status.FORWARDED:
                // this.proj_stat["Forwarded to vendor"].push(project);
                this.proj_stat["Approved"].push(project);
                break;
        case Status.PENDING:
                  this.proj_stat["Pending"].push(project);
                  break;
        
      }
    }
    console.log(this.proj_stat);
  }

  // statupdate(projectname: string, status: Status) {
  //   // Call the data service to update the project status on the server
  //   this.dataservice.statupdate(projectname, status).subscribe({
  //     next: (updatedProject) => {
  //       // Update the selected project in the local projects array
  //       const projectIndex = this.projects.findIndex(p => p.projectname === projectname);
  //       if (projectIndex !== -1) {
  //         // Update the status of the found project in the array
  //         this.projects[projectIndex].status = status;
  //       }
        
  //       // Refresh the categorized project statuses
  //       this.projectstatsep();
        
  //       // Optionally, set selectedProject for immediate display/update
  //       this.selectedProject = updatedProject;
  //     },
  //     error: (err) => {
  //       console.error('Failed to update project status:', err);
  //     }
  //   });
  // }

  statupdate(projectname : string, status: Status){
    console.log(status);
    const projindex = this.projects.findIndex(p=> p.projectname === projectname);
    if (projindex !== -1){
      const currentdate = new Date;
      this.projects[projindex].status = {status : status, by : "Dean Academic Affairs, IIT Palakkad", date : currentdate };
      console.log(this.projects[projindex].status);
      
    }
    console.log(this.proj_stat);
    this.projectstatsep();
    console.log(this.proj_stat);
    this.selectedProject = this.projects[projindex];
    console.log(this.selectedProject);
  }
  

  setActiveTab(status : string) {
    var index = this.disp_stat.indexOf(status);
    this.activetab = index; // Update the active tab
  }

  selectProject(request : Project){
    this.displaytables = false;
    this.selectedProject = request;
  }

  displaypreview(event : boolean){
    this.display = event;
  }

  projapprove(event : boolean){
    console.log(this.selectedProject.status);
    this.statupdate(this.selectedProject.projectname, Status.APPROVED);
    this.selectedProject = {} as Project;
    this.display = false;
    this.displaytables = true;

  }
  projreject(event : boolean){
    this.statupdate(this.selectedProject.projectname, Status.REJECTED);
    this.selectedProject = {} as Project;
    this.display = false;
    this.displaytables = true;
  }
  projsentback(event : boolean){
    this.statupdate(this.selectedProject.projectname, Status.CLARIFICATION);
    this.selectedProject = {} as Project;
    this.display = false;
    this.displaytables = true;
  }
  projforw(event : boolean){
    this.statupdate(this.selectedProject.projectname, Status.FORWARDED);
    this.selectedProject = {} as Project;
    this.display = false;
    this.displaytables = true;
  }

  commentrec(event: string){
    this.comment = event;
    this.selectedProject.remarks = this.comment;
    const projindex = this.projects.findIndex(p=> p.projectname === this.selectedProject.projectname);
    if (projindex !== -1){
      this.projects[projindex].remarks = this.comment;
    }
  }

  addnewdocs(event : pdf[]){
    const projindex = this.projects.findIndex(p=> p.projectname === this.selectedProject.projectname);
    if (projindex !== -1){
      this.projects[projindex].documents = event;
    }
  }
  selectfromtable(event : Project){
    this.displaytables = false;
    this.selectedProject = event;
  }

  viewtables(event : boolean){
    this.displaytables = event;
  }
  
}
