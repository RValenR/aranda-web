import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {

  authService = inject(AuthService);
  router = inject(Router);

  loginForm = new FormGroup({
    email: new FormControl<any>('', [Validators.required, Validators.email]),
    password: new FormControl<any>('', [Validators.required])
  })

  onSubmit(){
    this.authService.signIn(this.loginForm.value.email, this.loginForm.value.password)
    .then((resp: any) => {
      console.log(resp)
      if(resp.data.user.role === "authenticated"){
        this.router.navigate(['/mainlist'])
      }
    })
    .catch((err: any) => {
      console.log(err);
    })
  }
}
