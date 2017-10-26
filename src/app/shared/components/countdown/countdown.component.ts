import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'ntm-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.css']
})
export class CountdownComponent implements OnChanges {
  @Input() params;

  errors: any = [];

  counting: number;

  left: string;
  dayString: string;
  hourString: string;
  minuteString: string;

  day: number;
  hour: number;
  minute: number;

  message1: boolean;
  message2: boolean;

  constructor() { }

  ngOnChanges() {
    setTimeout(() => {
      this.countdown(); 
    }, 100);
  }

  countdown = () => {
    this.message1 = false;
    this.message2 = false;

    let todayDate = new Date();
    let todayMilisseconds = todayDate.getTime();
    let cd = 24 * 60 * 60 * 1000, ch = 60 * 60 * 1000;
    
    if(!this.params) {
      this.errors.push({
        cod: 'p-01',
        message: 'Definir parâmetros mínimos do componente'
      })
    } else {
      if(!this.params.milissecondsFinalDate) {
        this.errors.push({
          cod: 'c-01',
          message: 'Definir data final em milissegundos: - { milissecondsFinalDate: number }'
        })
      }else if(!this.params.milissecondsStartDate) {
        this.errors.push({
          cod: 'c-02',
          message: 'Definir data inicial em milissegundos: - { milissecondsStartDate: number }'
        })
      } else {
        this.errors = [];
      }
      
      if(this.errors.length < 1) {
        if(this.params.milissecondsFinalDate - this.params.milissecondsStartDate > 0) {
          setTimeout(() => {
            this.counting = this.params.milissecondsFinalDate - todayMilisseconds;
            this.day = Math.floor(this.counting / cd);
            if(this.day > 0) {
              if(this.day > 1) {
                this.left = "Faltam";
                this.dayString = "dias";
              } else {
                this.left = "Falta";
                this.dayString = "dia";
              }
            }

            this.hour = Math.floor( (this.counting - this.day * cd) / ch);
            if(this.hour > 0) {
              if(this.hour > 1) {
                this.hourString = "horas";
              } else {
                this.hourString = "hora";
              }
            }

            this.minute = Math.round( (this.counting - this.day * cd - this.hour * ch) / 60000);
            if(this.minute > 0) {
              if(this.minute == 60) {
                this.hour++;
                this.minute = null;
                this.hourString += "";
                this.dayString += " e"
              } else {
                if(this.minute > 1) {
                  this.hourString += " e";
                  
                  this.minuteString = "minutos";
                } else {
                  this.hourString += " e";
                  
                  this.minuteString = "minuto";
                }
              }
            }
            this.countdown();
          }, 100);
        } else if(this.params.milissecondsFinalDate - this.params.milissecondsStartDate < 0) {
          this.message2 = true;
        }
      } else {
        if(isNaN(this.params.milissecondsFinalDate)) {
          this.errors = [];
          this.message2 = true;
        } else if(this.params.milissecondsFinalDate == 0) {
          this.errors = [];
          this.message1 = true;
        }
      }
    }
  }
}
