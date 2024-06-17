import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {

  errorMessage: string | null = null;

  form = this.fb.group({
    pseudo: ['',[Validators.required],],
    password: ['',[Validators.required],],
  });

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {}

  get pseudo() {
    return this.form.controls['pseudo'];
  }

  get password() {
    return this.form.controls['password'];
  }

  onSubmit() {
    if (this.form.valid) {
      const { pseudo, password } = this.form.value;
      this.userService.login(pseudo ?? '', password ?? '').subscribe({
        next: (response) => {
          console.log('Connexion réussie', response);
          this.router.navigate(['/mainPage']);
        },
        error: (error) => {
          if (error.status === 400) {
            this.errorMessage = 'Pseudo ou mot de passe incorrect';
          } else {
            this.errorMessage = 'Échec de la connexion';
          }
        }
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

}