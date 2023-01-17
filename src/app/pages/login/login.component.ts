import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  private REAT_API_SERVER = 'http://127.0.0.1:8000/'
  private httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": 'application/json',
    })
  }

  constructor(
    private formBuilder: FormBuilder, 
    private httpClient: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  public formData = this.formBuilder.group({
    employeeUserName: ['', Validators.required],
    password: ['', Validators.required],
    company_code: ['Jxa1S9xIAudQ3lyN84w2', Validators.required],
  })

  public onSubmit (): void {
    const url = `${this.REAT_API_SERVER}api/employeeLogin`;

    this.httpClient.post<any>( url, this.formData.value, this.httpOptions )
    .pipe(catchError((error: any, caught: Observable<any>): Observable<any> => {
        // this.errorMessage = error.message;
        Swal.fire(error.message || "Login failed")

        // after handling error, return a new observable 
        // that doesn't emit any values and completes
        return of();
    }))
    .subscribe(data => {
      Swal.fire("Login success!")
      console.log('>>>check data', data);
      localStorage.setItem("employeeUserName", data.data.employeeUserName)
      localStorage.setItem("dataUser", JSON.stringify(data.data))
      this.router.navigate(['dashboard']);
    });
  }

  public  redirect() {
    this.router.navigate(['dashboard']);
} 

}
