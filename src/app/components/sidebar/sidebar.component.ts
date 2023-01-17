import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Inject }  from '@angular/core';
import { DOCUMENT } from '@angular/common'; 

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
  { path: '/dashboard', title: 'Dashboard',  icon: 'ni-tv-2 text-primary', class: '' },
  { path: '/user-profile', title: 'User profile',  icon:'ni-single-02 text-yellow', class: '' },
  { path: '/leave-remote', title: 'Leave & Remote',  icon:'ni ni-button-power text-danger', class: '' },
  // { path: '/login', title: 'Login',  icon:'ni-key-25 text-info', class: '' },
  // { path: '/register', title: 'Register',  icon:'ni-circle-08 text-pink', class: '' },


  // { path: '/leave', title: 'Leave-Remote',  icon:'ni ni-button-power', class: '' },
  { path: '/icons', title: 'Icons',  icon:'ni-planet text-blue', class: '' },
  // { path: '/maps', title: 'Maps',  icon:'ni-pin-3 text-orange', class: '' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public menuItems: any[];
  public isCollapsed = true;
  public pathLogin = '/login';
  public pathRegister = '/register';

  constructor(private router: Router, @Inject(DOCUMENT) document: Document) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
   });

   const employeeUserName = localStorage.getItem('employeeUserName')

    if (employeeUserName) {
      document.getElementById('login__nav').style.display = 'none'
      document.getElementById('register__nav').style.display = 'none'
    }

  }

  onLogout() {
    localStorage.removeItem("employeeUserName")
  }

  onChangePage() {

  }
}
