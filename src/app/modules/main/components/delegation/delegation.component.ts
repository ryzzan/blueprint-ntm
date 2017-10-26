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
  selector: 'app-delegation',
  templateUrl: './delegation.component.html',
  styleUrls: ['./delegation.component.css']
})
export class DelegationComponent implements OnInit {
  array: any;
  competitionId: number;
  delegationForm: FormGroup;
  paramsToTableData: any;
  title: string;
  count: number;
  /*update properties no change start*/
  paramToSearch: any;
  submitToCreate: boolean;
  submitToUpdate: boolean;
  submitButton: string;
  /*update properties no change end*/

  /*update properties specific start*/
  isForeign: boolean = false;
  /*update properties specific end*/

  constructor(
    private crud: CrudService,
    private mainService: MainService,
    private matsnackbar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router
  ) {
    console.log("entrou constructor");
   }
  
  ngOnInit() {

    /*update start*/
    this.route.params.subscribe(params => {
      if(params.id) {
        this.paramToSearch = params.id;
        this.submitToCreate = false;
        this.submitToUpdate = true;
        this.title = "Alterar Dados de Delegação";
        this.submitButton = "Atualizar";

        this.crud.read({
          route: 'delegations',
          order: ['id', 'desc'],
          where: [{
            field: 'id',
            value: this.paramToSearch.replace(':', '')
          }],
          page: 1
        }).then(res => {          
          let obj = res['obj'][0];
          
          this.delegationForm.get('initials').setValue(obj.initials);
          this.delegationForm.get('delegation_name').setValue(obj.delegation_name);
          
          if(obj.is_foreign == 1) {
            
            this.isForeign = true;
          } else { 
            this.isForeign = false;
          }
          this.delegationForm.get('is_foreign').setValue(this.isForeign);
        })
      } else {
        this.submitToCreate = true;
        this.submitToUpdate = false;
        this.title = "Nova Delegação";
        this.submitButton = "Salvar";
      }
    })
    /*update end*/

    this.delegationForm = new FormGroup({
      'competition_id': new FormControl(null),
      'initials': new FormControl(null,[Validators.maxLength(5),Validators.required]),
      'delegation_name': new FormControl(null,[Validators.maxLength(191),Validators.required]),
      'is_foreign': new FormControl(false)
    });
    this.count++;
    
    this.mainService
    .getCompetitionId()
    .subscribe(data => {
      this.competitionId = data;
      this.makeList();
    }, error => {
     console.log(error) 
    })
  }

  makeList = () => {
    this.paramsToTableData = {
      toolbar: {
        title: "Lista de delegações",
        delete: [{
          routeToApi: "delegations",
          routeAfterDelete: '/main/delegation',
          param: 'id'
        }],
        search: "id" //pk
      },
      list: {
        route: "delegations",
        show: ['initials', 'delegation_name', 'is_foreign'],
        header: ['Sigla', 'Delegação', 'Delegação Estrangeira'],
        order: ['id', 'desc'],
        edit: {route: '/main/delegation/', param: 'id'},
        page: 1,
        source: true,
        where: [{
          field:'competition_id',
          value: this.competitionId
        }],
        changeValue: [{
          field: 'is_foreign',
          fieldValue: 0,
          newValue: 'Não'
        }, {
          field: 'is_foreign',
          fieldValue: 1,
          newValue: 'Sim'
        }]
      },
      actionToolbar: {
        language: 'pt-br'
      }
    };
  }

  onDelegationSubmit = () => {
    if(this.submitToUpdate) {
      let params = {
        route: 'delegations',
        objectToUpdate: this.delegationForm.value,
        paramToUpdate: this.paramToSearch.replace(':', '')
      };
  
      this.crud.update(params)
      .then(res => {
        this.matsnackbar.open(res['message'], '', {
          duration: 2000
        })

        //this.competitionId = data;
        console.log(161);
        this.makeList();
      }, rej => {
        this.matsnackbar.open(rej['message'], '', {
          duration: 3000
        })
      })

      this.router.navigate(['/main/delegation']);
    } else {
      let objTemp = this.delegationForm.value;
      objTemp.competition_id = this.competitionId;

      let params = {
        route: 'delegations',
        objectToCreate: this.delegationForm.value
      };
      
      this.crud.create(params)
      .then(res => {
        this.matsnackbar.open(res['message'], '', {
          duration: 2000
        })

        this.delegationForm = new FormGroup({
          'competition_id': new FormControl(this.competitionId),
          'initials': new FormControl(null,[Validators.maxLength(5),Validators.required]),
          'delegation_name': new FormControl(null,[Validators.maxLength(191),Validators.required]),
          'is_foreign': new FormControl(false)
        });
  
        Object.keys(this.delegationForm.controls).forEach(key => {
          this.delegationForm.controls[key].setErrors(null)
        });

        this.makeList();
      }, rej => {
        this.matsnackbar.open(rej['message'], '', {
          duration: 3000
        })
      })
    }
  }
}
