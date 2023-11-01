import { HttpClient } from '@angular/common/http';
import { Component,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.css']
})
export class EditModalComponent {
  constructor(
    public dialogRef: MatDialogRef<EditModalComponent>,
    @Inject(MAT_DIALOG_DATA) public Interview: any,
    private http: HttpClient
  ) {}

  onSubmit(): void {
    // Handle saving changes here
    // You can access the edited batch using 'this.batch'
    
    // Close the dialog
    
    this.http.put(`http://localhost:8089/interviews/update`, this.Interview)
      .subscribe((response) => {
        // Handle the response from the backend here
        console.log('Candidate details updated:', response);

        // Close the dialog
        this.dialogRef.close();
      });
    // this.dialogRef.close();
  }

  onCancel(): void {
    // Handle canceling changes here
    
    // Close the dialog
    this.dialogRef.close();
  }
}
