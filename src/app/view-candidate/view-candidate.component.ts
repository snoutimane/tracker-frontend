import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Interview } from '../Models/interview';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { EditModalComponent } from '../edit-modal/edit-modal.component';


// interface Interview {
//   id:Number;
//   empId:Number;
//   employeeName: string;
//   email:string ;
//   projectName:string;
//   projectCode:string;
//   projectManager:string;
//   projectLocation:string;
//   interviewed:boolean;
//   interviewDate:Date;
//   feedback:string;
//   feedbackDescription:string;
//   comment:string;
//   proposedDate:Date;
//   mentorName:string;
//   image:string;
//   status:string;
// }

@Component({
  selector: 'app-view-candidate',
  templateUrl: './view-candidate.component.html',
  styleUrls: ['./view-candidate.component.css']
})
export class ViewCandidateComponent implements OnInit {
  candidates: Interview[] = [];
  showAttachmentModal: boolean = false;
  selectedAttachment:string| SafeResourceUrl = '';
  searchText: string = '';
  filteredCandidates: any[] = [];
  editedValue: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private sanitizer: DomSanitizer,
    private snackBar: MatSnackBar,
    private dialog: MatDialog  // Inject MatDialog
  ) {}

  filterCandidates() {
    console.log('Filtering candidates. Search Text:', this.searchText);
    
    if (!this.searchText || this.searchText.trim() === '') {
      // If search text is empty, show all candidates
      this.filteredCandidates = this.candidates;
    } else {
      // Filter candidates based on search text
      this.filteredCandidates = this.candidates.filter((candidate) => {
        // You can customize this condition to search in specific fields
        return (
          candidate.employeeName.toLowerCase().includes(this.searchText.toLowerCase()) ||
          candidate.email.toLowerCase().includes(this.searchText.toLowerCase())
          // Add more fields as needed
          // ...
        );
      });
    }
  
    // Log the filtered candidates for debugging
    console.log('Filtered Candidates:', this.filteredCandidates);
  }

  clearSearch() {
    this.searchText = '';
    this.filterCandidates(); // Reset to show all candidates
  }

  onSearchTextChange() {
    if (this.searchText.trim() !== '') {
      this.filterCandidates();
    } else {
      // If search text is empty, show all candidates
      this.filteredCandidates = this.candidates;
    }
  }

  ngOnInit(): void {
    this.fetchInterviews();
   this.checkData();
  }

<<<<<<< HEAD
  makeEditable(candidate:Interview){
    candidate.isEdit=!candidate.isEdit;
  }

  //save button functionality
  save(candidate:Interview){
   this.makeEditable(candidate);
    console.log("from frontend",candidate);
    this.http.post('http://localhost:8089/interviews/create', candidate).subscribe(data=>{
      alert("data updated Successfully");
    },error=>console.log(error));
    
  
  }

=======
>>>>>>> 74041e897c7c8cb1ae771ef989f8ed9181ecb687
  checkData(){
    console.log("datadfsfh",this.filteredCandidates);
  
  }

  fetchInterviews() {
    // Make an HTTP GET request to your Spring Boot backend API
    this.http.get<Interview[]>('http://localhost:8089/interviews/all').subscribe(
      (response) => {
        this.candidates = response;
        this.filteredCandidates = this.candidates; // Initialize filtered candidates
        console.log('Interviews:', this.candidates);
      },
      (error) => {
        console.error('Error fetching interviews:', error);
      }
    );
  }

  deleteCandidate(candidate: any) {
    const empId = candidate.empId;
    //const projectCode = candidate.projectCode;

    // Open the confirmation dialog
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { message: `Are you sure you want to delete the candidate with empId ${empId}?` }
    });

    // Subscribe to the result of the confirmation dialog
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // User clicked 'Yes', perform deletion logic here
        this.performDeleteCandidate(empId);
      } else {
        // User clicked 'No' or closed the dialog, handle accordingly
        console.log('User clicked No or closed the dialog');
      }
    });
  }

  private performDeleteCandidate(empId: Number) {
    // Make an HTTP DELETE request with the correct URL
    this.http.delete(`http://localhost:8089/interviews/delete/${empId}`, { responseType: 'text' })
      .subscribe(
        (response) => {
          if (response === 'Interview deleted successfully') {
            // Show a snackbar notification
            this.snackBar.open(`Candidate with empId ${empId} deleted successfully!`, 'Close', { duration: 3000 });

            // Reload the current route
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/view']);
            });
          } else {
            console.error(`Error deleting candidate with empId ${empId}: Unexpected response`);
            // Handle unexpected responses here
          }
        },
        (error) => {
          console.error(`Error deleting candidate with empId ${empId}:`, error);
          // Handle errors here
        }
      );
  }

  openAttachmentModal(attachmentUrl: string) {
    // Display the attachment in the modal
    this.selectedAttachment = this.sanitizeUrl(attachmentUrl);
    this.showAttachmentModal = true;
  }
  
  sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  
  closeAttachment() {
    // Close the modal
    this.showAttachmentModal = false;
    this.selectedAttachment = '';
  }
  openEditDialog(): void {
      // Make an HTTP GET request to your Spring Boot backend API
      this.http.put<Interview[]>('http://localhost:8089/interviews/update', this.candidates).subscribe(
        (response) => {
          this.candidates = response;
          console.log('Interviews:', this.candidates);
        },
        (error) => {
          console.error('Error updating interviews:', error);
        }
      );
    
  }
  // edit(data:any){
  //   console.log("candidate data:",data.target.innerText);
  //   console.log("fdgf",this.filteredCandidates)
  // }
  editCell(candidate: any) {
    // Set the edited value to the item's value
    this.editedValue = candidate.empId;
    candidate.isEditing = true;
  }

  // saveEditedValue(candidate: any) {
  //   candidate.empId = this.editedValue;
  //   candidate.isEditing = false;
  //   // Send the updated data to the server or perform any other actions
  // }

  saveEditedValue(candidate: any) {
    // Update the candidate's empId with the edited value
    candidate.empId = this.editedValue;
    candidate.isEditing = false;
  
    // Save the updated data to the database
    const apiUrl = `http://localhost:8089/interviews/update`;
  
    this.http.put<Interview[]>(apiUrl, [candidate]) // Wrap the single candidate in an array
      .subscribe(
        (updatedList: Interview[]) => {
          console.log('Candidate updated successfully.');
          // Handle the updated list here, e.g., update your local list with the new data
          this.filteredCandidates = updatedList;
        },
        (error) => {
          console.error('Error updating candidate:', error);
        }
      );
  }
  
  

}

