import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

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

  mainCompetitionForm: FormGroup;

  /**
   * Competition select start
   */
  competitionSelect: any;
  competitionSelected: any;
  /**
   * Competition select end
   */

   paramsToCountDown: any;

  constructor(
    private crud: CrudService
  ) { }

  ngOnInit() {
    this.mainCompetitionForm = new FormGroup({
      name: new FormControl(null)
    })

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

    this.crud.read({
      route: 'competitions',
      order: ['id', 'desc'],
      page: 1
    }).then(res => {
      let tempHostDate, lowerDate, competitionId, competitionName, todayDate, loopDate;
      todayDate = new Date();
      this.competitionSelect = res['obj'];

      //Checando a menor data de competição para countdown: início
      for(let lim = this.competitionSelect.length, i =0; i < lim; i++) {
        if(this.competitionSelect[i].hosts.length > 0) {
          if(i > 0) {
            for(let lim2 = this.competitionSelect[i].hosts.length, j = 0; j < lim2; j++) {
              loopDate = new Date(this.competitionSelect[i].hosts[j].initialDate);
              
              if(loopDate > todayDate) {
                if(loopDate < tempHostDate) {
                  lowerDate = this.competitionSelect[i].hosts[j].initialDate;
                  competitionId = this.competitionSelect[i].hosts[j].competition_id;
                  competitionName = this.competitionSelect[i].name;

                  this.competitionSelected = {
                    value: competitionId,
                    name: competitionName,
                    _lowerDate: lowerDate
                  }
                }

                tempHostDate = new Date(this.competitionSelect[i].hosts[j].initialDate);
              }
            }
          } else {
            loopDate = new Date(this.competitionSelect[i].hosts[0].initialDate);
            
            if(loopDate > todayDate) {
              tempHostDate = this.competitionSelect[i].hosts[0].initialDate;

              lowerDate = this.competitionSelect[i].hosts[0].initialDate;
              competitionId = this.competitionSelect[i].hosts[0].competition_id;
              competitionName = this.competitionSelect[i].name;

              this.competitionSelected = {
                value: competitionId,
                name: competitionName,
                _lowerDate: lowerDate
              }
            } else {
              tempHostDate = new Date('4000/12/30 03:00:00');
            }
          }
        }
      }
      console.log(this.mainCompetitionForm.get('name'));
      console.log(this.competitionSelected)
      this.mainCompetitionForm.get('name').setValue(this.competitionSelected.value);
      this.countdown();
      //Checando a menor data de competição para countdown: fim
    })
  }

  countdown = () => {
    let todayDate = new Date();
    let higherDateToCountdDown = new Date(this.competitionSelected._lowerDate);
    let higherNumberToCountDown = higherDateToCountdDown.getTime();

    this.paramsToCountDown = {
      milissecondsFinalDate: higherNumberToCountDown, 
      milissecondsStartDate: todayDate.getTime()
    };

    console.log(this.paramsToCountDown)
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
