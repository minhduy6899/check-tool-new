import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  private REAT_API_SERVER = 'http://127.0.0.1:8000/'
  private httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": 'application/json',
    })
  }
  constructor(
    private formBuilder: FormBuilder, 
    private httpClient: HttpClient
  ) { }

  public formData = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    phone: ['', Validators.required],
    address: ['', Validators.required],
    department: ['', Validators.required],
    employeeUserName: ['', Validators.required],
    password: ['', Validators.required],
    company_code: ['', Validators.required],
  })
  
  ngOnInit() {
  }

  public onSubmit (): void {
    const url = `${this.REAT_API_SERVER}api/createEmployee`;

    this.httpClient.post<any>( url, this.formData.value, this.httpOptions )
    .pipe(catchError((error: any, caught: Observable<any>): Observable<any> => {
        // this.errorMessage = error.message;
        Swal.fire(error.message || "Create employee failed")
        // after handling error, return a new observable 
        // that doesn't emit any values and completes
        return of();
    }))
    .subscribe(data => {
      Swal.fire("Create employee success!")
      this.formData.reset()
    });
  }
}
