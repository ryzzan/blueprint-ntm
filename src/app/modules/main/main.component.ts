import { Component, OnInit, OnChanges } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

/**
 * Services
 */
import { CrudService } from './../../shared/services/laravel/crud.service';
import { MainService } from './main.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnChanges {
  competitionsObject: any;
  paramsToMenuSideNav: any;
  competitionId: number;
  title: string = "SGO";

  mainCompetitionForm: FormGroup;

  /**
   * Competition select start
   */
  competitionSelect: any;
  competitionSelected: any;
  isLoading: boolean = true;
  /**
   * Competition select end
   */

   paramsToCountDown: any;

  constructor(
    private crud: CrudService,
    private mainService: MainService
  ) { }

  ngOnChanges () {
    console.log(41);
    this.mainService.setCompetitionId(this.mainCompetitionForm.get('name').value);
  }

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
        route: ['/main/delegation'],
        data: {competition_id: this.competitionId}
      }, {
        description: "Áreas Tecnológicas",
        route: ['/main/tech-area'],
        data: {competition_id: this.competitionId}
      }, {
        description: "Instituições",
        route: ['/main/institution'],
        data: {competition_id: this.competitionId}
      }, {
        description: "Ocupações",
        route: ['/main/occupation'],
        data: {competition_id: this.competitionId}
      }, {
        description: "Grupos de Perfis",
        route: ['/main/profile-group'],
        data: {competition_id: this.competitionId}
      }, {
        description: "Perfis de Participação",
        route: ['/main/participation-profile'],
        data: {competition_id: this.competitionId}
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
      this.isLoading = false;

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

                  this.competitionSelected = {
                    value: competitionId,
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

              this.competitionSelected = {
                value: competitionId,
                _lowerDate: lowerDate
              }
            } else {
              tempHostDate = new Date('4000/12/30 03:00:00');
            }
          }
        }
      }

      let tempNumber = parseInt(this.competitionSelected.value);
      this.mainCompetitionForm.get('name').setValue(tempNumber);
      this.countdown();
      this.competitionId = this.mainCompetitionForm.get('name').value;
      
      this.mainService.setCompetitionId(this.competitionId);
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
  }

  countdownChosen = (e) => {
    let tempHostDate, lowerDate, competitionId, competitionName, todayDate, loopDate;
    this.isLoading = true;
    this.paramsToCountDown = {};
    this.crud.read({
      route: 'competitions',
      order: ['id', 'desc'],
      where: [{
        field: 'id',
        value: e.value
      }]
    }).then(res => {
      let obj = res['obj'][0];
      let todayDate = new Date();
      let higherNumberToCountDown: number;
      this.isLoading = false;
      if(obj.hosts.length > 0) {
        for(let lim = obj.hosts.length, i = 0; i < lim; i++) {
          if(i > 0) {
            loopDate = new Date(obj.hosts[i].initialDate);
            
            if(loopDate > todayDate) {
              if(loopDate < tempHostDate) {
                lowerDate = obj.hosts[i].initialDate;
              }

              tempHostDate = new Date(obj.hosts[i].initialDate);
            }
          } else {
            loopDate = new Date(obj.hosts[0].initialDate);
            
            if(loopDate > todayDate) {
              tempHostDate = obj.hosts[0].initialDate;
              lowerDate = obj.hosts[0].initialDate;
            } else {
              tempHostDate = new Date('4000/12/30 03:00:00');
            }
          }

          let higherDateToCountdDown = new Date(lowerDate);
          let higherNumberToCountDown = higherDateToCountdDown.getTime();
  
          this.paramsToCountDown = {
            milissecondsFinalDate: higherNumberToCountDown, 
            milissecondsStartDate: todayDate.getTime()
          };
        }
      } else {
        this.paramsToCountDown = {
          milissecondsFinalDate: 0, 
          milissecondsStartDate: todayDate.getTime()
        };
      }
      //this.profileGroupForm.get('group_profile_name').setValue(obj.group_profile_name);

      this.competitionId = this.mainCompetitionForm.get('name').value;

      this.mainService.setCompetitionId(this.competitionId);
    })
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
