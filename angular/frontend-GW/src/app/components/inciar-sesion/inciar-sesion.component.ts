import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inciar-sesion',
  templateUrl: './inciar-sesion.component.html',
  styleUrls: ['./inciar-sesion.component.css']
})
export class InciarSesionComponent implements OnInit {

  user = {
    user: '',
    password: '',
    datos: JSON
  }

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  getUser(){
    return this.user.user;
  }

  getPassword(){
    return this.user.password;
  }

  iniciarSesion(){
    this.authService.iniciarSesion(this)
    .subscribe(
      res => {
        console.log(res),
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', this.user.user);
        this.router.navigate(['/public']);
      },
      err => console.log(err)
    )
  }
}
