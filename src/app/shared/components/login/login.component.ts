import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

/**Services */
import { AuthenticationService } from './../../services/laravel/authentication.service';

@Component({
  selector: 'ntm-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  @Input() params;

  errors = [];
  loginForm: FormGroup;

  constructor(
    private authentication: AuthenticationService,
    private matsnackbar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit() {
    if(this.params) {
      if(!this.params.route) {
        this.errors.push({
          cod: 'ntm-l-01',
          message: "Definir rota do login"
        });
      }
    } else {
      this.errors.push({
        cod: 'p-01',
        message: "Definir parâmetros mínimos do componente"
      });
    }

    this.loginForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email,Validators.maxLength(191)]),
      'password': new FormControl(null, [Validators.required,Validators.maxLength(191)])
    })
  }

  onForgotPassword = () => {
    this.router.navigate(this.params.forgotPasswordRoute);
  }

  onSubmit = () => {
    this.params.email = this.loginForm.get('email');
    this.params.password = this.loginForm.get('password');

    this.authentication.login(this.loginForm.value)
    .catch(error => {
      console.log(error)
    })
    .then(res => {
      let string = JSON.stringify(res);
      let json = JSON.parse(string);
      if(json.cod == "l-01") {
        this.matsnackbar.open(json.message, '', {
          duration: 2000
        });

        this.router.navigate(this.params.route);
      }

      if(json.cod == "le-01") {
        this.matsnackbar.open(json.message, '', {
          duration: 12000
        });
      }
    });
  }
}