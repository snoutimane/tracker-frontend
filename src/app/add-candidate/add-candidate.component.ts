import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Observable, Subscriber } from 'rxjs';
import * as XLSX from 'xlsx';

export class Interview {
  empId!: number;
  employeeName!: string;
  email!: string;
  baselineDate!: Date;
  localGrade!: string;
  currentDayStatus!: string;
  mainProject!: string;
  accountName!: string;
  trainingBatchId!: string;
  mentorName!: string;
  trainingScoreFeedback!: string;
  bucket!: string;
  qualitativeFeedback!: string;
  oceanAttemptedTillDate!: string;
  oceanScoreIfAttempted!: number;
  hsCertificationDone!: string;
  digiDashboardUpdatedRegularly!: Date;
  accountShadowsDone!: string;
  currentStatus!: string;
  upskillingWhileOnBench!: string;
  currentInitiativeInvolvedIn!: string;
  workDoneLast3Months!: string;
  personReachable!: string;
  pscRemarks!: string;
  btoAverageQ3Attendance: any; // Replace with appropriate type
  sapienceAvgLast3Months!: number;
  leaveBalance!: number;
  leaveAppliedLast3Months!: number;
  botpStatus!: string;
  subStatus!: string;
  college!: string;
  collegeType!: string;
  education!: string;
  recruitmentSwarScore!: number;
  recruitmentAptitudeScore!: number;
  recruitmentCodingScore!: number;
}


@Component({
  selector: 'app-add-candidate',
  templateUrl: './add-candidate.component.html',
  styleUrls: ['./add-candidate.component.css']
})
export class AddCandidateComponent {
  newCandidate: any = {
    baselineDate:'',
    mentorName: '',
    empId: null,
    employeeName: '',
    email: '',
    qualitativeFeedback: '',
    oceanAttemptedTillDate: '',
    oceanScoreIfAttempted: 0,
    hsCertificationDone: '',
    digiDashboardUpdatedRegularly: '',
    accountShadowsDone: '',
    currentStatus: '',
    upskillingWhileOnBench: '',
    currentInitiativeInvolvedIn: '',
    workDoneLast3Months: '',
    personReachable: '',
    pscRemarks: '',
    btoAverageQ3Attendance: null, // Update this type accordingly
    sapienceAvgLast3Months: 0,
    leaveBalance: 0,
    leaveAppliedLast3Months: 0,
    botpStatus: '',
    subStatus: ''
  };

  file: { progress: number }[] = [];

  constructor(private datePipe: DatePipe, private httpClient: HttpClient) {}

  showAlertForPastDate: boolean = false;

  // checkForPastDate() {
  //   const selectedDate = new Date(this.newCandidate.proposedDate);
  //   const currentDate = new Date();

  //   this.showAlertForPastDate = selectedDate < currentDate;
  // }

  validateForm(): boolean {
    // Check if required fields are empty
    if (
      !this.newCandidate.mentorName ||
      !this.newCandidate.empId ||
      !this.newCandidate.employeeName ||
      !this.newCandidate.email ||
      !this.newCandidate.qualitativeFeedback ||
      !this.newCandidate.oceanAttemptedTillDate ||
      this.newCandidate.oceanScoreIfAttempted === null ||
      !this.newCandidate.hsCertificationDone ||
      !this.newCandidate.digiDashboardUpdatedRegularly ||
      !this.newCandidate.accountShadowsDone ||
      !this.newCandidate.currentStatus ||
      !this.newCandidate.upskillingWhileOnBench ||
      !this.newCandidate.currentInitiativeInvolvedIn ||
      !this.newCandidate.workDoneLast3Months ||
      !this.newCandidate.personReachable ||
      !this.newCandidate.pscRemarks ||
      this.newCandidate.btoAverageQ3Attendance === null ||
      this.newCandidate.sapienceAvgLast3Months === null ||
      this.newCandidate.leaveBalance === null ||
      this.newCandidate.leaveAppliedLast3Months === null ||
      !this.newCandidate.botpStatus ||
      !this.newCandidate.subStatus ||
      !this.newCandidate.college ||
      !this.newCandidate.collegeType ||
      !this.newCandidate.education ||
      this.newCandidate.recruitmentSwarScore === null ||
      this.newCandidate.recruitmentAptitudeScore === null ||
      this.newCandidate.recruitmentCodingScore === null
    ) {
      alert('Please fill in all required fields.');
      return false; // Prevent form submission
    } else {
      // Optionally, add additional validation logic based on your requirements
  
      this.addCandidate();
      return true;
    }
  }
  

  addCandidate() {
    // Format the proposedDate before sending it to the backend
    this.newCandidate.baselineDateDate = this.formatDate(this.newCandidate.baselineDate);

    // Format the interviewDate if the candidate was interviewed
    // if (this.newCandidate.interviewed) {
    //   this.newCandidate.interviewDate = this.formatDate(this.newCandidate.interviewDate);
    //   // Check if the interview date is less than the current date
    //   if (new Date(this.newCandidate.interviewDate) >= new Date()) {
    //     alert('Interview date cannot be in the future.');
    //     return; // Prevent form submission if interview date is in the past
    //   }
    // }

    if (!this.isValidEmail(this.newCandidate.email)) {
      alert('Please enter a valid email address.');
      return; // Prevent form submission if email is invalid
    }

    // if (!this.isValidManagerEmail(this.newCandidate.projectManager)) {
    //   alert('Please enter a valid Manager email address.');
    //   return; // Prevent form submission if email is invalid
    // }

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
      mentorName: '',
      empId: 0,
      employeeName: '',
      email: '',
      qualitativeFeedback: '',
      oceanAttemptedTillDate: '',
      oceanScoreIfAttempted: 0,
      hsCertificationDone: '',
      digiDashboardUpdatedRegularly: '',
      accountShadowsDone: '',
      currentStatus: '',
      upskillingWhileOnBench: '',
      currentInitiativeInvolvedIn: '',
      workDoneLast3Months: '',
      personReachable: '',
      pscRemarks: '',
      btoAverageQ3Attendance: null, // Update this type accordingly
      sapienceAvgLast3Months: 0,
      leaveBalance: 0,
      leaveAppliedLast3Months: 0,
      botpStatus: '',
      subStatus: '',
      college: '',
      collegeType: '',
      education: '',
      recruitmentSwarScore: 0,
      recruitmentAptitudeScore: 0,
      recruitmentCodingScore: 0
    };
  }

  private formatDate(date: string): string {
    return date ? this.datePipe.transform(new Date(date), 'yyyy-MM-dd') || '' : '';
  }

  private isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@capgemini\.com$/;
    return emailPattern.test(email);
  }

  // private isValidManagerEmail(projectManager: string): boolean {
  //   const emailPattern = /^[a-zA-Z0-9._%+-]+@capgemini\.com$/;
  //   return emailPattern.test(projectManager);
  // }

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

 // myImage!: Observable<any>;
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
      //this.myImage = d;
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
        empId: row[1],
        employeeName: row[2],
        email: row[3],
        baselineDate:row[0], // Add default values or modify as needed
        localGrade:row[4], // Add default values or modify as needed
        currentDayStatus:row[5], // Add default values or modify as needed
        mainProject:row[6], // Add default values or modify as needed
        accountName:row[7], // Add default values or modify as needed
        trainingBatchId:row[8], // Add default values or modify as needed
        mentorName: row[9],
        trainingScoreFeedback: row[10], // Add default values or modify as needed
        bucket:row[11], // Add default values or modify as needed
        qualitativeFeedback: row[12],
        oceanAttemptedTillDate: row[13],
        oceanScoreIfAttempted: row[14],
        hsCertificationDone: row[15],
        digiDashboardUpdatedRegularly:row[16],
        accountShadowsDone: row[17],
        currentStatus: row[18],
        upskillingWhileOnBench: row[19],
        currentInitiativeInvolvedIn: row[20],
        workDoneLast3Months: row[21],
        personReachable: row[22],
        pscRemarks: row[23],
        btoAverageQ3Attendance: row[24], // Update this accordingly
        sapienceAvgLast3Months: row[25],
        leaveBalance: row[26],
        leaveAppliedLast3Months: row[27],
        botpStatus: row[28],
        subStatus: row[29],
        college:row[30], // Add default values or modify as needed
        collegeType:row[31], // Add default values or modify as needed
        education:row[32], // Add default values or modify as needed
        recruitmentSwarScore: row[33], // Update this accordingly
        recruitmentAptitudeScore: row[34], // Update this accordingly
        recruitmentCodingScore: row[35] // Update this accordingly
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
