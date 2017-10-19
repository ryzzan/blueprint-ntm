import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

/**
 * Services
 */
import { CrudService } from './../../../../shared/services/laravel/crud.service';

@Component({
  selector: 'app-occupation',
  templateUrl: './occupation.component.html',
  styleUrls: ['./occupation.component.css']
})
export class OccupationComponent implements OnInit {
  array: any;
  hostToSelect: any;
  occupationForm: FormGroup;
  occupationGroupToSelect: any;
  institutionToSelect: any;
  paramToSearch: any;
  paramsToTableData: any;
  submitButton: string;
  submitToCreate: boolean;
  submitToUpdate: boolean;
  title: string;

  /**
   * Update related properties
   */
  institutionId;

  constructor(
    private crud: CrudService,
    private matsnackbar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    /*update start*/
    this.route.params.subscribe(params => {
      if(params.id) {
        this.paramToSearch = params.id;
        this.submitToCreate = false;
        this.submitToUpdate = true;
        this.title = "Alterar Dados de Ocupação";
        this.submitButton = "Atualizar";

        this.crud.read({
          route: 'occupations',
          order: ['id', 'desc'],
          where: [{
            where: 'id',
            value: this.paramToSearch.replace(':', '')
          }]
        }).then(res => {
          let obj = res['obj'][0];
          
          this.occupationForm.patchValue(obj);
        })
      } else {
        this.submitToCreate = true;
        this.submitToUpdate = false;
        this.title = "Nova Ocupação";
        this.submitButton = "Salvar";
      }
    })
    /*update end*/

    this.crud.read({
      route: 'occupations-groups',
      show: ['id', 'occupation_group_name'],

      order: ['id', 'desc']
    })
    .then(res => {
      this.occupationGroupToSelect = res['obj'];
    });

    this.crud.read({
      route: 'hosts',
      show: ['id', 'host_name'],

      order: ['host_name', 'asc']
    })
    .then(res => {
      this.hostToSelect = res['obj'];
    });

    this.crud.read({
      route: 'institutions',
      show: ['id', 'institution_name'],
      order: ['institution_name', 'asc']
    })
    .then(res => {
      this.institutionToSelect = res['obj'];
    });

    this.occupationForm = new FormGroup({
      'competition_id': new FormControl(1),
      'occupation_name': new FormControl(null,[Validators.maxLength(191),Validators.required]),
      'occupation_number': new FormControl(null,[Validators.maxLength(5),Validators.required]),
      'number_participants': new FormControl(null),
      'age_limit': new FormControl(null,Validators.required),
      'occupation_group_id': new FormControl(null,Validators.required),
      //'group_code_forum': new FormControl(null),
      'nickname': new FormControl(null,[Validators.maxLength(191)]),
      'is_demonstration': new FormControl(false),
      'is_disability': new FormControl(false),
      'host_id': new FormControl(null),
      'institution_id': new FormControl(null)
    });

    this.makeList();
  }

  makeList = () => {
    this.paramsToTableData = {
      toolbar: {
        title: "Lista de ocupações",
        delete: [{
          routeToApi: "occupations",
          routeAfterDelete: '/main/occupation',
          param: 'id'
        }],
        search: true
      },
      list: {
        route: "occupations",
        show: ['occupation_name','occupation_number','number_participants','age_limit','is_disability','is_demonstration'],
        header: ['Ocupação','Número','Participantes por equipe','Idade limite','PCDs','Demonstração'],
        order: ['id', 'desc'],
        edit: {route: '/main/occupation/', param: 'id'},
        source: true,
        changeValue: [{
          field: 'is_disability',
          fieldValue: 0,
          newValue: 'Não'
        }, {
          field: 'is_disability',
          fieldValue: 1,
          newValue: 'Sim'
        },{
          field: 'is_demonstration',
          fieldValue: 0,
          newValue: 'Não'
        },{
          field: 'is_demonstration',
          fieldValue: 1,
          newValue: 'Sim'
        }]
      },
      actionToolbar: {
        language: 'pt-br'
      }
    };
  }

  onChangeDemonstrationOccupation = (event) => {
    this.occupationForm.get('is_demonstration').setValue(event.checked);
  }

  onChangePCDOccupation = (event) => {
    this.occupationForm.get('is_disability').setValue(event.checked);
  }
  
  onOccupationSubmit = () => {
    if(this.submitToUpdate) {
      let params = {
        route: 'occupations',
        objectToUpdate: this.occupationForm.value,
        paramToUpdate: this.paramToSearch.replace(':', '')
      };
  
      this.crud.update(params)
      .then(res => {
        this.matsnackbar.open(res['message'], '', {
          duration: 2000
        })

        this.makeList();
      }, rej => {
        this.matsnackbar.open(rej['message'], '', {
          duration: 3000
        })
      })
      
      this.router.navigate(['/main/occupation']);
    } else {
      let params = {
        route: 'occupations',
        objectToCreate: this.occupationForm.value
      };
      
      this.crud.create(params)
      .then(res => {
        this.matsnackbar.open(res['message'], '', {
          duration: 2000
        });

        this.makeList();
      }, rej => {
        this.matsnackbar.open(rej['message'], '', {
          duration: 3000
        });
      })

      this.occupationForm.reset();
      
      this.router.navigate(['/main/occupation']);
    }
  }
}