import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

/**
 * Services
 */
import { CrudService } from './../../../../shared/services/laravel/crud.service';
import { MainService } from './../../main.service';

@Component({
  selector: 'app-institution',
  templateUrl: './institution.component.html',
  styleUrls: ['./institution.component.css']
})
export class InstitutionComponent implements OnInit {
  array: any;
  competitionId: number;
  institutionForm: FormGroup;
  paramToSearch: any;
  paramsToTableData: any;
  submitToCreate: boolean;
  submitToUpdate: boolean;
  submitButton: string;
  title: string;

  constructor(
    private crud: CrudService,
    private mainService: MainService,
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
        this.title = "Alterar Dados de Instituição";
        this.submitButton = "Atualizar";
        
        this.crud.read({
          route: 'institutions',
          order: ['id', 'desc'],
          where: [{
            field: 'id',
            value: this.paramToSearch.replace(':', '')
          }]
        })
        .catch(err => console.log(err))
        .then(res => {
          console.log(res)
          let obj = res['obj'][0];

          this.institutionForm.get('institution_name').setValue(obj.institution_name);
        })
      } else {
        this.submitToCreate = true;
        this.submitToUpdate = false;
        this.title = "Nova Instituição";
        this.submitButton = "Salvar";
      }
    })
    /*update end*/

    this.institutionForm = new FormGroup({
      'competition_id': new FormControl(null),
      'institution_name': new FormControl(null,Validators.required)
    });

    this.mainService
    .getCompetitionId()
    .subscribe(data => {
      this.competitionId = data;
      
      this.institutionForm = new FormGroup({
        'competition_id': new FormControl(this.competitionId),
        'institution_name': new FormControl(null,Validators.required)
      });

      this.makeList();
    }, error => {
     console.log(error)      
    })
  }

  makeList = () => {
    this.paramsToTableData = {
      toolbar: {
        title: "Lista de instituições",
        delete: [{
          routeToApi: "institutions",
          routeAfterDelete: '/main/institution',
          param: 'id'
        }],
        search: 'id'
      },
      list: {
        route: "institutions",
        show: ['institution_name'],
        header: ['Instituição'],
        order: ['id', 'desc'],
        edit: {route: '/main/institution/', param: 'id'},
        source: true,
        where: [{
          field:'competition_id',
          value: this.competitionId
        }]
      },
      actionToolbar: {
        language: 'pt-br'
      }
    };
  }
  
  onInstitutionSubmit = () => {
    if(this.submitToUpdate) {
      let params = {
        route: 'institutions',
        objectToUpdate: this.institutionForm.value,
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

      this.router.navigate(['/main/institution']);
    } else {
      let params = {
        route: 'institutions',
        objectToCreate: this.institutionForm.value
      };

      this.crud.create(params)
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

      this.institutionForm.get('institution_name').setValue(null);
      
      this.router.navigate(['/main/institution']);
    }
  }
}
