import { CrudService } from './../../services/laravel/crud.service';
import { Component, Input, OnInit, trigger, transition, style, animate, state } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ntm-menu-sidenav',
  animations: [
    trigger(
      'firstAnimation',
      [
        transition(
        ':enter', [
          style({transform: 'translateX(-100%)', opacity: 0}),
          animate('200ms', style({transform: 'translateX(0)', 'opacity': 1}))
        ]
      ),
      transition(
        ':leave', [
          style({transform: 'translateX(0)', 'opacity': 1}),
          animate('200ms', style({transform: 'translateX(-100%)', 'opacity': 0}),
          )]
      )]
    ),
    trigger(
      'myAnimation',
      [
        transition(
        ':enter', [
          style({transform: 'translateX(-100%)', opacity: 0}),
          animate('200ms', style({transform: 'translateX(0)', 'opacity': 1}))
        ]
      ),
      transition(
        ':leave', [
          style({transform: 'translateX(0)', 'opacity': 1}),
          animate('200ms', style({transform: 'translateX(-100%)', 'opacity': 0}),
          )]
      )]
    ),
    trigger(
      'buttonAnimation',
      [
        transition(
        ':enter', [
          style({transform: 'translateX(-100%)', opacity: 0}),
          animate('200ms', style({transform: 'translateX(0)', 'opacity': 1}))
        ]
      ),
      transition(
        ':leave', [
          style({transform: 'translateX(0)', 'opacity': 1}),
          animate('200ms', style({transform: 'translateX(-100%)', 'opacity': 0}),
          )]
      )]
    )
  ],
  templateUrl: './menu-sidenav.component.html',
  styleUrls: ['./menu-sidenav.component.css']
})
export class MenuSidenavComponent implements OnInit {
  @Input() params;

  errors = [];
  mdIconClose: string;
  mdIconOpen: string;
  toggle: boolean = false;
  userData: any;
  userName: string;

  constructor(
    private crud: CrudService,
    private router: Router
  ) { }

  ngOnInit() {
    if(this.params) {
      if(!this.params.mdIconOpen) {
        this.mdIconOpen = "menu";
      } else {
        this.mdIconOpen = this.params.mdIconOpen;
      }

      if(!this.params.mdIconClose) {
        this.mdIconClose = "close";
      } else {
        this.mdIconClose = this.params.mdIconClose;
      }

      if(!this.params.menuSettings) {
        this.errors.push({
          cod: 'bm-lo-01',
          message: "Definir configuração do menu ({menuSettings: [{description: string, route: string}]})"
        });
      }
    } else {
      this.errors.push({
        cod: 'p-01',
        message: "Definir parâmetros mínimos do componente"
      });
    }

    this.crud.read({
      route: 'user'
    })
    .then(res => {
      let nameArray;

      this.userData = res['obj'];
      
      if(this.userData.name) {
        nameArray = this.userData.name.split(" ");
        this.userName = nameArray[0] //+ " " + nameArray[nameArray.length - 1];
      } else {
        this.userName = "Sem nome cadastrado"
      }
    })
  }

  onMenuRoute = (route) => {
    this.router.navigate(route);
    this.toggle = !this.toggle;
  }

  onToggle = (event) => {
    this.toggle = !this.toggle;
  }
}
