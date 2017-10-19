import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

/**
 * Services
 */
import { CrudService } from './../../../../shared/services/laravel/crud.service';

@Component({
  selector: 'app-tech-area',
  templateUrl: './tech-area.component.html',
  styleUrls: ['./tech-area.component.css']
})
export class TechAreaComponent implements OnInit {
  array: any;
  occupationsGroupsForm: FormGroup;
  paramsToTableData: any;  
  title: string;
  /*update properties no change start*/
  paramToSearch: any;
  submitToCreate: boolean;
  submitToUpdate: boolean;
  submitButton: string;
  /*update properties no change end*/

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
        this.title = "Alterar Dados de Área Tecnológica";
        this.submitButton = "Atualizar";
        
        this.crud.read({
          route: 'occupations-groups',
          order: ['id', 'desc'],
          where: [{
            where: 'id',
            value: this.paramToSearch.replace(':', '')
          }]
        }).then(res => {
          console.log(res)  
          let obj = res['obj'][0];

          this.occupationsGroupsForm.get('occupation_group_name').setValue(obj.occupation_group_name);
        })
      } else {
        this.submitToCreate = true;
        this.submitToUpdate = false;
        this.title = "Nova Área Tecnológica";
        this.submitButton = "Salvar";
      }
    })
    /*update end*/

    this.occupationsGroupsForm = new FormGroup({
      'competition_id': new FormControl(1),
      'occupation_group_name': new FormControl(null,[Validators.maxLength(191),Validators.required])
    });

    this.makeList();
  }

  makeList = () => {
    this.paramsToTableData = {
      toolbar: {
        title: "Lista de Áreas Tecnológicas",
        delete: [{
          routeToApi: "occupations-groups",
          routeAfterDelete: '/main/tech-area',
          param: 'id'
        }],
        search: true
      },
      list: {
        route: "occupations-groups",
        show: ['occupation_group_name'],
        header: ['Nome'],
        order: ['id', 'desc'],
        edit: {route: '/main/tech-area/', param: 'id'},
        source: true
      },
      actionToolbar: {
        language: 'pt-br'
      }
    };
  }
  
  onOccupationsGroupsSubmit = () => {
    if(this.submitToUpdate) {
      let params = {
        route: 'occupations-groups',
        objectToUpdate: this.occupationsGroupsForm.value,
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

      this.router.navigate(['/main/tech-area']);
    } else {
      let params = {
        route: 'occupations-groups',
        objectToCreate: this.occupationsGroupsForm.value
      };

      this.crud.create(params)
      .then(res => {
        this.matsnackbar.open(res['message'], '', {
          duration: 2000
        })

        this.makeList();
        this.occupationsGroupsForm.reset();
      }, rej => {
        this.matsnackbar.open(rej['message'], '', {
          duration: 3000
        })
      })
      
      this.router.navigate(['/main/tech-area']);
    }
  }
}
