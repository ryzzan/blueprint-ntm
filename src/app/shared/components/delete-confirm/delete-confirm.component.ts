import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

/*Services*/
import { CrudService } from './../../services/laravel/crud.service';

@Component({
  selector: 'ntm-delete-confirm',
  templateUrl: './delete-confirm.component.html',
  styleUrls: ['./delete-confirm.component.css']
})

export class DeleteConfirmComponent implements OnInit {
  @Output()
  change: EventEmitter<string> = new EventEmitter<string>();

  dataToDelete: any;
  
  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmComponent>,
    private crud: CrudService,
    private router: Router,
    private matsnackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {
  }
   
  delete() {
    this.crud
    .delete({
      route: this.data.routeToApi,
      paramToDelete: this.data.paramToDelete
    })
    .then(() => {
      console.log(this.data.routeToApi)
      let array: any;
      let string: string;

      this.router.navigate([this.data.routeAfterDelete]);

      if(this.data.paramToDelete.length < 2) { 
        array= [1, "item", "apagado"];
      } else {
        array= [this.data.paramToDelete.length, "itens", "apagados"];
      };

      string = array[0] + " " + array[1] + " " + array[2];

      this.matsnackbar.open(string, '', {
        duration: 3000
      });
    });
    
    this.dialogRef.close();
  }
}
