//import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http'; // Import HttpClient to make HTTP requests
import { Router } from '@angular/router'; // Import Router for navigation

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})

export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loginFailed: boolean | undefined;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router // Inject Router for navigation
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

   onSubmit(): void {
    //this.router.navigate(['dashboard']);
    if (this.loginForm.valid) {
      const username = this.loginForm.value.username;
      const password = this.loginForm.value.password;

      // Send the authentication request to your backend
      this.http
        .post<any>('http://localhost:8089/admin/authenticate', { username, password }).subscribe(
          (response) => {
            if (response.jwt && response.jwt !== 'No') {
            // Handle successful login response from the server
            //const token = response.jwt;
           // sessionStorage.setItem('token', token);
            // localStorage.setItem('username', response.username);
            let token = 'Bearer ' + response.jwt;
            sessionStorage.setItem('token', token);
            console.log('Login successful', response);
            console.log(token);
            // Redirect to a dashboard or any other page upon successful login
            this.router.navigate(['/dashboard']); // Replace with your route
            }else{
              this.loginFailed = true;
            }
          },
          (error) => {
            // Handle authentication error
            console.error('Login failed', error);
            // Display an error message to the user
            // You can set an error message property and display it in the template
            this.loginFailed = true;
          }
        );
    }

   }

}

 