import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css']
})
export class RegistrarComponent implements OnInit {

  user = {
    user: '',
    password: ''
  }

  constructor(private authService: AuthService, private router: Router) { 

  }

  ngOnInit(): void {
  }

  registrar(){
    this.authService.registrar(this.user)
    .subscribe(
      res => {
        console.log(res),
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', this.user.user);
        this.router.navigate(['/public']);
      },
      err => 
        console.log(err)
      
    )
  }
}
