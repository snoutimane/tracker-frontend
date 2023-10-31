import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Observable, Subscriber } from 'rxjs';
import * as XLSX from 'xlsx';

export class Interview {
  empId!: number;
  employeeName!: string;
  email!: string;
  projectName!: string;
  projectCode!: string;
  projectManager!: string;
  projectLocation!: string;
  proposedDate!: Date;
  mentorName!: string;
  interviewed!: boolean;
  interviewDate!: Date;
  feedback!: string;
  feedbackDescription!: string;
  comment!: string;
  image!: string;
  status!: string;
}

@Component({
  selector: 'app-add-candidate',
  templateUrl: './add-candidate.component.html',
  styleUrls: ['./add-candidate.component.css']
})
export class AddCandidateComponent {
  newCandidate: any = {
    proposedDate: '',
    mentorName: '',
    empId: null,
    employeeName: '',
    email: '',
    projectCode: '',
    projectName: '',
    projectManager: '',
    projectLocation: '',
    interviewed: false,
    interviewDate: '',
    feedback: '',
    feedbackDescription: '',
    comment: '',
    image: '',
    status: ''
  };

  file: { progress: number }[] = [];

  constructor(private datePipe: DatePipe, private httpClient: HttpClient) {}

  showAlertForPastDate: boolean = false;

  checkForPastDate() {
    const selectedDate = new Date(this.newCandidate.proposedDate);
    const currentDate = new Date();

    this.showAlertForPastDate = selectedDate < currentDate;
  }

  validateForm(): boolean {
    // Check if required fields are empty
    if (
      !this.newCandidate.proposedDate ||
      !this.newCandidate.mentorName ||
      !this.newCandidate.empId ||
      !this.newCandidate.employeeName ||
      !this.newCandidate.email ||
      !this.newCandidate.projectCode ||
      !this.newCandidate.projectName ||
      !this.newCandidate.projectManager ||
      !this.newCandidate.projectLocation
    ) {
      alert('Please fill in all required fields.');
      return false; // Prevent form submission
    } else {
      this.addCandidate();
      return true;
    }
  }

  addCandidate() {
    // Format the proposedDate before sending it to the backend
    this.newCandidate.proposedDate = this.formatDate(this.newCandidate.proposedDate);

    // Format the interviewDate if the candidate was interviewed
    if (this.newCandidate.interviewed) {
      this.newCandidate.interviewDate = this.formatDate(this.newCandidate.interviewDate);
      // Check if the interview date is less than the current date
      if (new Date(this.newCandidate.interviewDate) >= new Date()) {
        alert('Interview date cannot be in the future.');
        return; // Prevent form submission if interview date is in the past
      }
    }

    if (!this.isValidEmail(this.newCandidate.email)) {
      alert('Please enter a valid email address.');
      return; // Prevent form submission if email is invalid
    }

    if (!this.isValidManagerEmail(this.newCandidate.projectManager)) {
      alert('Please enter a valid Manager email address.');
      return; // Prevent form submission if email is invalid
    }

    // Make an HTTP POST request to your backend API
    this.httpClient.post('http://localhost:8089/interviews/create', this.newCandidate)
      .subscribe(
        (response) => {
          alert('Candidate added successfully!');
          // Optionally, handle success response here
        },
        (error) => {
          console.error('Error adding candidate:', error);
          // Handle errors here
        }
      );

    // Clear the newCandidate object for the next candidate
    this.resetCandidateForm();
  }

  resetCandidateForm() {
    this.newCandidate = {
      proposedDate: '',
      mentorName: '',
      empId: null,
      employeeName: '',
      email: '',
      projectCode: '',
      projectName: '',
      projectManager: '',
      projectLocation: '',
      interviewed: false,
      interviewDate: '',
      feedback: '',
      feedbackDescription: '',
      comment: '',
      image: '',
      status: ''
    };
  }

  private formatDate(date: string): string {
    return date ? this.datePipe.transform(new Date(date), 'yyyy-MM-dd') || '' : '';
  }

  private isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@capgemini\.com$/;
    return emailPattern.test(email);
  }

  private isValidManagerEmail(projectManager: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@capgemini\.com$/;
    return emailPattern.test(projectManager);
  }

  handleFileInput(files: any[]) {
    this.prepareFilesList(files);
  }

  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.file.push(item);
    }
    this.uploadFilesSimulator(0);
  }

  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.file.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.file[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.file[index].progress += 5;
          }
        }, 200);
      }
    }, 1000);
  }

  myImage!: Observable<any>;
  base64code!: any;

  onChange = ($event: Event) => {
    const target = $event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    this.convertToBase64(file);
  };

  convertToBase64(file: File) {
    const observable = new Observable((subscriber: Subscriber<any>) => {
      this.readFile(file, subscriber);
    });
    observable.subscribe((d) => {
      this.myImage = d;
      this.base64code = d;
    });
  }

  readFile(file: File, subscriber: Subscriber<any>) {
    const filereader = new FileReader();
    filereader.readAsDataURL(file);
    filereader.onload = () => {
      subscriber.next(filereader.result);
      subscriber.complete();
    };
    filereader.onerror = () => {
      subscriber.error();
      subscriber.complete();
    };
  }

  uploadedData: Interview[] = [];
  showFileInput: boolean = false;

  onFileChange(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const workbook = XLSX.read(e.target.result, { type: 'binary' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      // Assuming the Excel sheet has a specific structure
      const excelData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Map the extracted data to the Interview class structure
      this.uploadedData = excelData.slice(1).map((row) => ({
        empId: row[0],
        employeeName: row[1],
        email: row[2],
        projectName: row[3],
        projectCode: row[4],
        projectManager: row[5],
        projectLocation: row[6],
        interviewed: row[7],
        interviewDate: new Date(row[8]),
        feedback: row[9],
        feedbackDescription: row[10],
        comment: row[11],
        proposedDate: new Date(row[12]),
        mentorName: row[13],
        image: row[14],
        status: row[15]
      }));
    };

    reader.readAsBinaryString(file);
  }

  saveInterviewData() {
    const apiUrl = 'http://localhost:8089/interviews/createall';
    console.log('Data sent to the backend:', this.uploadedData);

    this.httpClient.post(apiUrl, this.uploadedData).subscribe(
      (response) => {
        // Handle the response from the backend if needed.
        console.log('Data sent to the backend:', response);
      },
      (error) => {
        // Handle errors here.
        console.error('Error sending data to the backend:', error);
      }
    );
  }

  uploadFile() {
    this.showFileInput = true;
    // Now, you can send this.uploadedData to your backend API.
    this.saveInterviewData();
    alert('Candidates added successfully');
  }
}
