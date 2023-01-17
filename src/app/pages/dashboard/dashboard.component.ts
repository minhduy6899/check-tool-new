import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import Chart from 'chart.js';
import Swal from 'sweetalert2';
import deg2rad from 'deg2rad';
import { getDistance } from 'geolib';
// import {} from '@types/googlemaps';
// import { AgmCoreModule, MapsAPILoader } from "@agm/core";

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2
} from "../../variables/charts";
import { Router } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  // public haversine = require("haversine-distance");
  public datasets: any;
  public data: any;
  public salesChart;
  public clicked: boolean = true;
  public clicked1: boolean = false;
  public today = new Date()
  public checkInAt: string = "00:00:00";
  public checkOutAt: string = "00:00:00";
  public currentDay: Date;
  public currentDate;
  public companyPosition = { lat: 10.787957, lng: 106.678361 }
  public checkPosition = { lat: null, lng: null }
  public distanceCheck;

  name = 'Angular';
  public lat;
  public lng;
  public employeeUserName: string; 
  public employeeId: string; 
  public employeeCompanyCode: string; 
  public startShiftHour: number;
  public startShiftSecond: number;
  public endShiftHour: number;
  public endShiftSecond: number;
  public historyChecking;
  public dataUserCheckIn = {
    employee_id: "",
    company_code: "",
    shiftsName: "",
    checkInTime: ""
  };
  public dataUserCheckOut = {
    employee_id: "",
    company_code: "",
    shiftsName: "",
    checkOutTime: "",
    id: ""
  };
  public formData = this.formBuilder.group({
    employeeUserName: ['', Validators.required],
    password: ['', Validators.required],
    company_code: ['', Validators.required],
  })
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


  // ====================================
  // HANDLE RELOAD
  // ====================================
  ngOnInit() {
      // var distance = parseFloat(getDistanceFromLatLonInKm(this.companyPosition.lat, this.companyPosition.lng, this.companyPosition.lat, this.companyPosition.lng).toFixed(1));  
      // var p1 = new google.maps.LatLng(-12.928646, -38.509659);
      // var p2 = new google.maps.LatLng(-12.929426, -38.517798);
      // const distance = (google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 1000).toFixed(2)
      // console.log('xxxxxxxxxxxxxxx check distance: ', distance);



    this.datasets = [
      [0, 20, 10, 30, 15, 40, 20, 60, 60],
      [0, 20, 5, 25, 10, 30, 15, 40, 40]
    ];
    this.data = this.datasets[0];

    var chartOrders = document.getElementById('chart-orders');

    parseOptions(Chart, chartOptions());


    // var ordersChart = new Chart(chartOrders, {
    //   type: 'bar',
    //   options: chartExample2.options,
    //   data: chartExample2.data
    // });

    // var chartSales = document.getElementById('chart-sales');

    // this.salesChart = new Chart(chartSales, {
		// 	type: 'line',
		// 	options: chartExample1.options,
		// 	data: chartExample1.data
		// });

    this.employeeUserName  = localStorage.getItem('employeeUserName')
    this.employeeId  = JSON.parse(localStorage.getItem('dataUser')).id
    this.employeeCompanyCode = JSON.parse(localStorage.getItem('dataUser')).company_code

    this.dataUserCheckIn.employee_id = JSON.parse(localStorage.getItem('dataUser')).id
    console.log('>>>>>>>>>>>--------Check employee_id: ', this.dataUserCheckIn.employee_id);
    this.dataUserCheckIn.company_code = JSON.parse(localStorage.getItem('dataUser')).company_code

    this.dataUserCheckOut.employee_id = JSON.parse(localStorage.getItem('dataUser')).id
    this.dataUserCheckOut.company_code = JSON.parse(localStorage.getItem('dataUser')).company_code
 

   console.log('>>>---', this.employeeCompanyCode);
    console.log('hello');

    this.currentDay = new Date()
    this.currentDate = this.currentDay.getDate()
    const CheckDate = localStorage.getItem('checkDate')
    const checkOutDate = localStorage.getItem('checkOutDate')
    const isCheckedIn = localStorage.getItem('checkedIn')
    const isCheckedOut = localStorage.getItem('checkedOut')
    const checkedInAt = localStorage.getItem('checkInAt')
    const checkedOutAt = localStorage.getItem('checkOutAt')

    console.log('-------------999>', this.currentDate);

    if (CheckDate === JSON.stringify(this.currentDate) && isCheckedIn === 'yes') {
      document.getElementById("btn__check-out").style.display = "inline-block"
      document.getElementById("btn__check-in").style.display = "none"
      this.checkInAt = checkedInAt
    }

    if (checkOutDate === JSON.stringify(this.currentDate) && isCheckedOut === 'yes') {
      document.getElementById("btn__check-out").style.display = "none"
      document.getElementById("btn__check-in").style.display = "none"
      this.checkOutAt = checkedOutAt
    }

    this.getShift()
    this.getHistoryCheck()
  }


  public updateOptions() {
    this.salesChart.data.datasets[0].data = this.data;
    this.salesChart.update();
  }


  // ====================================
  // HANDLE GET SHIFT
  // ====================================
  public getShift() {
    const url = `${this.REAT_API_SERVER}api/getTimeShiftsById?company_code=${this.employeeCompanyCode}&id=1`;

    this.httpClient.post<any>(url, this.httpOptions )
    .pipe(catchError((error: any, caught: Observable<any>): Observable<any> => {
        // this.errorMessage = error.message;
        // Swal.fire(error.message || "Login failed")

        // after handling error, return a new observable 
        // that doesn't emit any values and completes
        return of();
    }))
    .subscribe(data => {
      // Swal.fire("Login success!")
      console.log('>>>check Shift', data);
      this.dataUserCheckIn.shiftsName = data.data[0].shiftsName
      this.dataUserCheckOut.shiftsName = data.data[0].shiftsName
      this.startShiftHour = parseInt(data.data[0].checkInTime.slice(0, 2))
      this.startShiftSecond = parseInt(data.data[0].checkInTime.slice(3, 4))
      this.endShiftHour = parseInt(data.data[0].checkOutTime.slice(0, 2))
      this.endShiftSecond = parseInt(data.data[0].checkOutTime.slice(3, 4))
      // localStorage.setItem("employeeUserName", data.data.employeeUserName)
      // this.router.navigate(['dashboard']);
    });
  }


  // ====================================
  // HANDLE CHECK IN
  // ====================================
  public onCheckIn (): void {
    // Get location
    this.getPosition().then(pos=>
      {
        this.checkPosition.lat = pos.lat
        this.checkPosition.lng = pos.lng
          console.log(`Positon: ${pos.lng} ${pos.lat}`);
      });

    const distance = getDistance(
      { latitude: this.companyPosition.lat, longitude: this.companyPosition.lng },
      { latitude: this.checkPosition.lat, longitude: this.checkPosition.lng }
    )

    console.log('-=============== distanc check: ', distance);

    this.getDistanceFromLatLonInKm()

    const url = `${this.REAT_API_SERVER}api/CheckIn`;
    const checkInTime = new Date()
    const CheckInHour = checkInTime.getHours()
    const CheckInMinute = checkInTime.getMinutes()
    const CheckDate = checkInTime.getDate()
    const isCheckedIn = localStorage.getItem('checkedIn')

    this.dataUserCheckIn.checkInTime = JSON.stringify(checkInTime)

    const startShiftTime = this.startShiftHour * 60 + this.startShiftSecond
    const startCheckInTime = CheckInHour * 60 + CheckInMinute
    console.log('--------check StarshiftHour: ', this.startShiftHour);
    console.log('--------check startShiftSecond: ', this.startShiftSecond);
    console.log('--------check endShiftHour: ', this.endShiftHour);
    console.log('--------check endShiftSecond: ', this.endShiftSecond);
    
    console.log('--------check gio: ', CheckInHour);
    console.log('--------check phut: ', CheckInMinute);

    if (distance > 200) {
      Swal.fire(`You were out of check in zone ${distance} meter.`)
      return
    }

    if (CheckDate === this.currentDate && isCheckedIn === 'yes') {
      Swal.fire("You were checked")
    }

    if (startCheckInTime - startShiftTime > 0 || startCheckInTime - 810 > 0) {
      Swal.fire("You are late!")
    }

    setTimeout(() => {
          this.httpClient.post<any>( url, this.dataUserCheckIn, this.httpOptions )
    .pipe(catchError((error: any, caught: Observable<any>): Observable<any> => {
        // this.errorMessage = error.message;
        Swal.fire(error.message || "Check In failed")

        // after handling error, return a new observable 
        // that doesn't emit any values and completes
        return of();
    }))
    .subscribe(data => {
      Swal.fire("Check In success!")
      document.getElementById("btn__check-out").style.display = "inline-block"
      document.getElementById("btn__check-in").style.display = "none"
      console.log('>>>check data', data);
      this.dataUserCheckOut.id = data.data.id
      this.checkInAt = `${checkInTime.getHours()}:${checkInTime.getMinutes()}:${checkInTime.getSeconds()}`

      localStorage.setItem('checkInId', data.data.id)
      localStorage.setItem('checkInAt', this.checkInAt)
      localStorage.setItem('checkDate', JSON.stringify(CheckDate))
      localStorage.setItem('checkedIn', 'yes')


      this.getHistoryCheck()
    });
    }, 2000);
  }


  // ====================================
  // HANDLE CHECK OUT
  // ====================================
  public onCheckOut (): void {
        // Get location
        this.getPosition().then(pos=>
          {
            this.checkPosition.lat = pos.lat
            this.checkPosition.lng = pos.lng
              console.log(`Positon: ${pos.lng} ${pos.lat}`);
          });
    
        const distance = getDistance(
          { latitude: this.companyPosition.lat, longitude: this.companyPosition.lng },
          { latitude: this.checkPosition.lat, longitude: this.checkPosition.lng }
        )
    
        console.log('-=============== distanc check out: ', distance);
    const checkOutTime = new Date()
    const checkOutDate =  checkOutTime.getDate()
    this.dataUserCheckOut.checkOutTime = JSON.stringify(checkOutTime)
    const url = `${this.REAT_API_SERVER}api/CheckOut`;
    const checkInId = localStorage.getItem('checkInId')

    if (!checkInId) {
      Swal.fire("Your must checkin first!")
      return
    }

    if (distance > 200) {
      Swal.fire(`You were out of check in zone ${distance} meter.`)
      return
    }

    this.httpClient.post<any>( url, this.dataUserCheckOut, this.httpOptions )
    .pipe(catchError((error: any, caught: Observable<any>): Observable<any> => {
        // this.errorMessage = error.message;
        Swal.fire(error.message || "Check Out failed")

        // after handling error, return a new observable 
        // that doesn't emit any values and completes
        return of();
    }))
    .subscribe(data => {
      Swal.fire("Check Out success!")
      console.log('>>>check data', data);

      document.getElementById("btn__check-out").style.display = "none"
      this.checkOutAt = `${checkOutTime.getHours()}:${checkOutTime.getMinutes()}:${checkOutTime.getSeconds()}`

      localStorage.removeItem('checkInId')
      localStorage.setItem('checkOutAt', this.checkOutAt)
      localStorage.setItem('checkOutDate', JSON.stringify(checkOutDate))
      localStorage.setItem('checkedOut', 'yes')

      this.getHistoryCheck()
      // localStorage.setItem("employeeUserName", data.data.employeeUserName)
      // this.router.navigate(['dashboard']);
    });
  }


  // ====================================
  // HANDLE GET HISTORY
  // ====================================
  public getHistoryCheck (): void {

    const url = `${this.REAT_API_SERVER}api/getAllCheckByemployeeId`;

    this.httpClient.post<any>( url, {company_code: this.employeeCompanyCode, employee_id: this.employeeId}, this.httpOptions )
    .pipe(catchError((error: any, caught: Observable<any>): Observable<any> => {
        // this.errorMessage = error.message;
        // Swal.fire(error.message || "Check Out failed")
        console.log(error);
        
        // after handling error, return a new observable 
        // that doesn't emit any values and completes
        return of();
    }))
    .subscribe(data => {
      console.log('>>>check history', data);
 
      const historyData = data
            console.log('>>>check history before check', historyData);
      for (let index = 0; index < historyData.data.length; index++) {
        console.log("======>", historyData.data[index].checkInTime);
        const currentTimeIn = new Date(JSON.parse(historyData.data[index].checkInTime))
        const currentTimeOut = new Date(JSON.parse(historyData.data[index].CheckOutTime))
        historyData.data[index].checkInTime = `${currentTimeIn.getHours()}:${currentTimeIn.getMinutes()}:${currentTimeIn.getSeconds()}`

        historyData.data[index].CheckOutTime = `${currentTimeOut.getHours()}:${currentTimeOut.getMinutes()}:${currentTimeOut.getSeconds()}`
              console.log('>>>check history middle check', historyData);

        historyData.data[index].created_at = historyData.data[index].created_at.toString().slice(0, 11)
      }
      this.historyChecking = historyData.data
      console.log('>>>check history after check', historyData);
      // localStorage.setItem("employeeUserName", data.data.employeeUserName)
      // this.router.navigate(['dashboard']);
    });
  }

// ====================================
// GET LOCATION
// ====================================

// getLocation() {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition((position: Position) => {
//       if (position) {
//         console.log("Latitude: " + position.coords.latitude +
//           "Longitude: " + position.coords.longitude);
//         this.lat = position.coords.latitude;
//         this.lng = position.coords.longitude;
//         console.log(this.lat);
//         console.log(this.lat);
//       }
//     },
//       (error: PositionError) => console.log(error));
//   } else {
//     alert("Geolocation is not supported by this browser.");
//   }
// }

getPosition(): Promise<any>
{
  return new Promise((resolve, reject) => {

    navigator.geolocation.getCurrentPosition(resp => {

        resolve({lng: resp.coords.longitude, lat: resp.coords.latitude});
      },
      err => {
        reject(err);
      });
  });

}


 public getDistanceFromLatLonInKm() : void {
  const R: any = 6371; // Radius of the earth in km
  const dLat = (this.checkPosition.lat - this.companyPosition.lat) * Math.PI / 180;
  const dLon = (this.checkPosition.lng - this.companyPosition.lng) * Math.PI / 180;

  var a = 
    0.5 - Math.cos(dLat)/2 
    + Math.cos(this.companyPosition.lat * Math.PI / 180) * Math.cos(this.checkPosition.lat * Math.PI / 180) 
    * (1 - Math.cos(dLon))/2
    ;

  const c =  R * 2 * Math.asin(Math.sqrt(a))

  this.distanceCheck = c;


  // var dLat: any = toRad(this.companyPosition.lat - this.checkPosition.lat);
  //     var dLon: any = toRad(this.companyPosition.lng - this.checkPosition.lng);
  //     var lat1: any = toRad(this.companyPosition.lat);
  //     var lat2: any = toRad(this.checkPosition.lat);

  //     const a: any = Math.sin(dLat/2) * Math.sin(dLat/2) +
  //     Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 

  //     var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  //     var d = R * c;
      
  //     console.log('---------------->>>>> check distance: ', d);

  //     return d

  // const dLat: any  = deg2rad(this.checkPosition.lat - this.companyPosition.lat);  // deg2rad below
  // const dLon: any = deg2rad(this.checkPosition.lng -this.companyPosition.lng); 
  // var a: any = 
  //   Math.sin(dLat/2) * Math.sin(dLat/2) 
  //   + Math.cos(deg2rad(this.companyPosition.lat)) * Math.cos(deg2rad(this.checkPosition.lat)) 
  //   * Math.sin(this.companyPosition.lng/2) * Math.sin(this.checkPosition.lng/2)
  //   ; 

  // console.log('---------> check a: ', a);

  // const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)) * 6371; 

  console.log('---------> check a: ', a);
  console.log('---------> check c: ', c);

  // const d: any = 6371 * c; // Distance in km
  // console.log('---------> distance: ', d);
}

// public calculateDistance() {
//   const mexicoCity = new google.maps.LatLng(19.432608, -99.133209.);
//   const jacksonville = new google.maps.LatLng(40.730610, -73.935242.);
//   // const distance = google.maps.geometry.spherical.computeDistanceBetween(nyc, london);
// }

  // public showPosition = (position) => {
  //   const crd = position.coords;

  //   console.log('Your current position is:');
  //   console.log(`Latitude : ${crd.latitude}`);
  //   console.log(`Longitude: ${crd.longitude}`);
  //   console.log(`More or less ${crd.accuracy} meters.`);
  //   setLatitudeCheck(crd.latitude);
  //   setLongitudeCheck(crd.longitude);
  //   getDistanceCalculation();
  // }

  // // get map Gps
  // public getGpsLocation = async () => {
  //   // return new Promise(async (resolve) => {
  //   //   let location = await navigator.geolocation.getCurrentPosition(showPosition);
  //   //   console.log(">>>check location ", location);

  //   //   return resolve(true);
  //   // });


  //   if (!navigator.geolocation) {
  //     alert('Permission to access location was denied')
  //     return
  //   }
  //   navigator.geolocation.getCurrentPosition(showPosition)
  // };

  // // get distance calculation
  // public getDistanceCalculation = () => {
  //   return new Promise(async (resolve) => {
  //     var dis = getDistance(
  //       // { latitude: 10.787958166366703, longitude: 106.6782129961472 },
  //       { latitude: 10.787957, longitude: 106.678361 },
  //       { latitude: latitudeCheck, longitude: longitudeCheck }
  //     );
  //     console.log('>>>>check distance: ', dis);
  //     setDistanceCheck(dis / 1000);
  //     return resolve(true);
  //   });
  // };
}







// function deg2rad(arg0: number) {
//   throw new Error('Function not implemented.');
// }

// function toRad(arg0: number) {
//   throw new Error('Function not implemented.');
// }
// const onCheckInPress = () => {
//   // distance is greater then 15m function alert only
//   if (
//     distanceCheck > 150000 ||
//     distanceCheck == "" ||
//     distanceCheck == undefined
//   ) {
//     getGpsLocation();
//     alert("Please wait, loading your GPS!");
//   } 
//   // else if (distanceCheck > 50 || distanceCheck == "") {
//   //   getGpsLocation();
//   //   // when aver distance is lower than 15m then function works
//   //   alert(
//   //     "Your are curently out of check in range: " +
//   //     `${distanceCheck}` +
//   //     " meters"
//   //   );

//   //   setModalVisible(!modalVisible);
//   // } 
//   else if (distanceCheck < 150000) {
//     if (checkOutImage !== "") {
//       alert("You are already checked out!");
//       setModalVisible(!modalVisible);
//     } else if (checkInImage === "" && checkOutImage === "") {
//       // start
//       if (
//         (today.getHours() >= 7 && today.getHours() <= 10) ||
//         (today.getHours() >= 12 && today.getHours() <= 14) ||
//         (today.getHours() >= 17 && today.getHours() <= 20)
//       ) {
//         // update data to firebase
//         updates[
//           "/ALLXONE/" +
//           userUid +
//           "/CheckIn" +
//           "/" +
//           todayDate +
//           "-" +
//           todayMonth +
//           "/Working"
//         ] = postData;
//         return update(ref(db), updates)
//           .then(() => {
//             setCheckInImage(picture);
//             setModalVisible(!modalVisible);
//             setButtonModify("Check out now");
//             setButtonCheckIn(<OutputIcon />);
//             setHours(today.getHours());
//             setMinutes(today.getMinutes());
//             setSeconds(today.getSeconds());
//             localStorage.setItem('btn-checkin', JSON.stringify(false))
//             localStorage.setItem('btn-checkout', JSON.stringify(true))
//           })
//           .catch((error) => {
//             alert(error);
//           });
//       } else {
//         alert("Out of the check in time please come back later");
//         setModalVisible(!modalVisible);
//       }
//     } else if (checkInImage !== "" && checkOutImage === "") {
//       if (
//         (today.getHours() >= 11 && today.getHours() <= 13) ||
//         (today.getHours() >= 17 && today.getHours() <= 19) ||
//         (today.getHours() >= 20 && today.getHours() <= 23)
//       ) {
//         database
//           .ref(
//             "/ALLXONE/" +
//             userUid +
//             "/CheckIn/" +
//             todayDate +
//             "-" +
//             todayMonth +
//             "/Working"
//           )
//           .update({
//             TimeOut: todayHours + ":" + todayMinutes + ":" + todaySeconds,
//             DateOut: todayDate + "/" + todayMonth + "/" + todayYears,
//           })
//           .then(() => {
//             setCheckInImage(picture);
//             setModalVisible(!modalVisible);
//             setButtonModify("Check out now");
//             setButtonCheckIn(<OutputIcon />);
//             setHours2(today.getHours());
//             setMinutes2(today.getMinutes());
//             setSeconds2(today.getSeconds());
//           })
//           .catch((error) => {
//             alert(error);
//           });
//       } else {
//         alert("Out of the check out time please come back later");
//         setModalVisible(!modalVisible);
//       }
//     }
//   }
// };