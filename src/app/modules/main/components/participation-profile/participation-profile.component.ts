import { MainService } from './../../main.service';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

/**
 * Services
 */
import { CrudService } from './../../../../shared/services/laravel/crud.service';

@Component({
  selector: 'app-participation-profile',
  templateUrl: './participation-profile.component.html',
  styleUrls: ['./participation-profile.component.css']
})
export class ParticipationProfileComponent implements OnInit {
  array: any;
  competitionId: number;
  participationProfileForm: FormGroup;
  paramToSearch: any;
  paramsToTableData: any;
  submitToCreate: boolean;
  submitToUpdate: boolean;
  submitButton: string;
  title: string;

  //Selects
  profileGroupToSelect: any;
  participationProfileToSelect: any;

  participationProfileCheckLength: boolean = false;


  constructor(
    private route: ActivatedRoute,
    private crud: CrudService,
    private mainService: MainService,
    private matsnackbar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit() {
    /*update start*/
    this.route.params.subscribe(params => {
      if(params.id) {
        this.paramToSearch = params.id;
        this.submitToCreate = false;
        this.submitToUpdate = true;
        this.title = "Alterar Dados de Perfil de Participação";
        this.submitButton = "Atualizar";

        this.crud.read({
          route: 'profiles',
          order: ['id', 'desc'],
          where: [{
            field: 'id',
            value: this.paramToSearch.replace(':', '')
          }]
        }).then(res => {
          
          let obj = res['obj'][0];

          this.participationProfileForm.patchValue(obj);
        })
      } else {
        this.submitToCreate = true;
        this.submitToUpdate = false;
        this.title = "Novo Perfil de Participação";
        this.submitButton = "Salvar";
      }
    })
    /*update end*/

    this.participationProfileForm = new FormGroup({
      'invites': new FormArray([]),
      'competition_id': new FormControl(null),
      'profile_name': new FormControl(null),
      'profile_group_id': new FormControl(null),
      'show_percentage_preparation': new FormControl(false),
      'require_participant_association_occupation': new FormControl(false),
      'require_participant_association_delegation': new FormControl(false),
      'intentional_management': new FormControl(false)
    });

    //Selects start
    this.crud.read({
      route: 'profiles-groups',
      show: ['id', 'group_profile_name'],

      order: ['group_profile_name', 'asc']
    })
    .then(res => {
      this.profileGroupToSelect = res['obj'];
    });

    this.crud.read({
      route: 'profiles',
      show: ['id', 'profile_name'],

      order: ['profile_name', 'asc']
    })
    .then(res => {
      if(res['obj'].length > 0) {
        this.participationProfileCheckLength = true;
      }

      this.participationProfileToSelect = res['obj'];
    });
    //Selects End

    this.mainService
    .getCompetitionId()
    .subscribe(data => {
      this.competitionId = data;
      
      this.participationProfileForm = new FormGroup({
        'invites': new FormArray([]),
        'competition_id': new FormControl(this.competitionId),
        'profile_name': new FormControl(null),
        'profile_group_id': new FormControl(null),
        'show_percentage_preparation': new FormControl(false),
        'require_participant_association_occupation': new FormControl(false),
        'require_participant_association_delegation': new FormControl(false),
        'intentional_management': new FormControl(false)
      });

      this.makeList();
    }, error => {
     console.log(error)      
    })
  }

  makeList = () => {
    this.paramsToTableData = {
      toolbar: {
        title: "Lista de perfis de participantes",
        delete: [{
          routeToApi: "profiles",
          routeAfterDelete: '/main/participation-profile',
          param: 'id'
        }],
        search: 'id'
      },
      list: {
        route: "profiles",
        show: ['profile_name'],
        header: ['Perfil de Participação'],
        order: ['id', 'asc'],
        edit: {route: '/main/participation-profile/', param: 'id'},
        source: true,
        where: [{
          field: 'competition_id',
          value: this.competitionId
        }]
      },
      actionToolbar: {
        language: 'pt-br'
      }
    }
  }
  //Slide Toggle related methods start
  onChangePercentageDemonstration = (event) => {
    this.participationProfileForm.get('show_percentage_preparation').setValue(event.checked);
  }

  onChangePaticipantAssociationOccupation = (event) => {
    this.participationProfileForm.get('require_participant_association_occupation').setValue(event.checked);
  }

  onChangePaticipantAssociationDelegation = (event) => {
    this.participationProfileForm.get('require_participant_association_delegation').setValue(event.checked);
  }

  onChangeIntentionalManagement = (event) => {
    this.participationProfileForm.get('intentional_management').setValue(event.checked);
  }
  //Slide Toggle related methods end

  //Related to invites array start
  onAddInvitationPermission = () => {
    let backgroundColor;
    let matDatePickerId1 = this.participationProfileForm.get('invites').value.length + "id1";
    let matDatePickerId2 = this.participationProfileForm.get('invites').value.length + "id2";

    if((this.participationProfileForm.get('invites').value.length % 2 == 0)) {
      backgroundColor = '#cfd8dc';
    } else {
      backgroundColor = '#fff';
    }

    let control = new FormGroup({
      'profile_group_id': new FormControl(this.participationProfileForm.get('profile_group_id').value),
      '_backgroundColor': new FormControl(backgroundColor),
      '_matDatePickerId1': new FormControl(matDatePickerId1),
      '_matDatePickerId2': new FormControl(matDatePickerId2)
    });
    
    (<FormArray>this.participationProfileForm.get('invites')).push(control);

    this.participationProfileForm.get('profile_group_id').setValue(null);
  }

  onRemoveInvitationPermission = (index) => {
    console.log(205)
    const control = <FormArray>this.participationProfileForm.controls['invites'];
    control.removeAt(index);

    for(let lim = this.participationProfileForm.get('invites').value.length, i =0; i < lim; i++) {
      if((i % 2 == 0)) {
        control.controls[i].patchValue({_backgroundColor: '#cfd8dc'})
      } else {
        control.controls[i].patchValue({_backgroundColor: '#fff'})
      }
    }
  }
  //Related to invites array end
  
  
  onParticipationProfileSubmit = () => {
    if(this.submitToUpdate) {
      let params = {
        route: 'profiles',
        objectToUpdate: this.participationProfileForm.value,
        paramToUpdate: this.paramToSearch.replace(':', '')
      };
  
      this.crud.update(params)
      .then(res => {
        this.matsnackbar.open(res['message'], '', {
          duration: 2000
        })
      }, rej => {
        this.matsnackbar.open(rej['message'], '', {
          duration: 3000
        })
      })
      
      this.makeList();
  
      this.router.navigate(['/main/participation-profile']);
    } else {
      let params = {
        route: 'profiles',
        objectToCreate: this.participationProfileForm.value
      };

      this.crud.create(params)
      .then(res => {
        this.matsnackbar.open(res['message'], '', {
          duration: 2000
        })
      }, rej => {
        this.matsnackbar.open(rej['message'], '', {
          duration: 3000
        })
      })

      this.participationProfileForm.reset();

      this.makeList();
    }
  }
}
