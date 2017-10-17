import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, NativeDateAdapter, MatSnackBar } from '@angular/material';

@Component({
  selector: 'ntm-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  @Input() params;
  @Output() scheduleOutput = new EventEmitter();

  chooseDate: boolean = false;
  chooseSortOfDate: boolean = false;
  chooseTime: boolean = false;
  dateObject: any = [];
  datesCounting: any = [];
  errors: any = [];
  intervalsCounting: any = [];
  mask: any = {
    time: [/\d/, /\d/, ':', /\d/, /\d/]
  };
  newDate: any = [];
  newInterval: any = [];
  placeholderToDatepicker: string;
  scheduleForm: FormGroup;
  
  constructor(private dateAdapter: DateAdapter<NativeDateAdapter>) {}

  ngOnInit() {
    this.scheduleForm = new FormGroup({
      'date': new FormControl(null),
      'timeStart': new FormControl(null),
      'timeEnd': new FormControl(null),
      'dates': new FormGroup({
        'date': new FormControl(null)
      }), 'intervals': new FormGroup({
        'intervalsArray': new FormArray([
          new FormControl(null), //starting date
          new FormControl(null) //ending date
        ]),
        'timesArray': new FormArray([
          new FormControl(null), //corresponding interval id
          new FormControl(null), //starting hour
          new FormControl(null) //ending hour
        ])
      })
    })

    if(this.params) {
      if(!this.params.language) {
        this.params.language = "pt-BR";
      }
  
      if(this.params.language == "pt-BR") {
        this.placeholderToDatepicker = "Escolha uma data";
      }

      this.dateAdapter.setLocale(this.params.language);
    } else {
      this.errors.push({
        cod: "p-01",
        message: "Definir parâmetros mínimos do componente"
      })
    }
  }

  onAddDateCounting = () => {
    this.datesCounting.push({
      cod: this.datesCounting.length
    })

    this.chooseDate = !this.chooseDate;
    this.chooseTime = false;
    
    /*const controlDate = new FormControl(null, Validators.required);
    (<FormArray>this.scheduleForm.get('dates.datesArray')).push(controlDate);

    this.scheduleOutput.emit(this.scheduleForm.value);*/
  }

  onAddDateValue = (index) => {
    this.dateObject.push({
      date: this.scheduleForm.get('date').value
    });
    
    this.scheduleForm.reset();

    this.chooseDate = false;
  }

  onAddDateTimeCounting = (index) => {
    this.chooseTime = !this.chooseTime;
    this.chooseDate = false;
    /*const controlDateTime = new FormControl(null, Validators.required);
    (<FormArray>this.scheduleForm.get('dates.timesArray')).push(controlDateTime);

    this.scheduleOutput.emit(this.scheduleForm.value);*/
  }

  onAddInterval = () => {
    const controlInterval = new FormControl(null, Validators.required);
    (<FormArray>this.scheduleForm.get('intervals.intervalsArray')).push(controlInterval);

    this.scheduleOutput.emit(this.scheduleForm.value);
  }

  onNewDate = () => {
    this.chooseSortOfDate = !this.chooseSortOfDate;
  }

  onRemoveDate = (index) => {
    this.datesCounting.splice(index, 1);
    this.chooseDate = false;
    this.chooseTime = false;
    //(<FormArray>this.scheduleForm.get('dates.datesArray')).removeAt(index);
  }
}
