import { Component, OnInit } from '@angular/core';

/**
 * Services
 */
import { CrudService } from './../../shared/services/laravel/crud.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  competitionsObject: any;
  paramsToMenuSideNav: any;
  title: string = "SGO";

  constructor(
    private crud: CrudService
  ) { }

  ngOnInit() {
    this.paramsToMenuSideNav = {
      menuSettings: [{
        description: "Competições",
        route: ['/main/competition']
      }, {
        description: "Delegações",
        route: ['/main/delegation']
      }, {
        description: "Áreas Tecnológicas",
        route: ['/main/tech-area']
      }, {
        description: "Instituições",
        route: ['/main/institution']
      }, {
        description: "Ocupações",
        route: ['/main/occupation']
      }, {
        description: "Grupos de Perfis",
        route: ['/main/profile-group']
      }, {
        description: "Perfis de Participação",
        route: ['/main/participation-profile']
      }]
    }

    this.setCompetitionsObject();
  }

  setCompetitionsObject = () => {
    let params = {
      route: 'competitions',
      order: ['name', 'asc']
    };

    this.crud.read(params)
    .then(res => {
      this.competitionsObject = res['obj'];
    })
  }
}
