import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { UserService } from '../services/user.service';
import { User } from '../data/user';
import { Router } from '@angular/router';
import { hasLowerCase, hasNumeric, hasSpecialCharacter, hasUpperCase, passwordMatchValidator } from '../validators/text.validator';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})

export class SignupComponent {
  errorMessage: string | null = null;
  currentStep: number = 1;

  form: FormGroup = this.fb.group({

    email: ['', {
      validators: [Validators.required, Validators.email, Validators.minLength(8)],
      updateOn: 'blur',
    }],

    password: ['', [
      Validators.required, Validators.minLength(8), hasUpperCase(), hasLowerCase(), hasNumeric(),hasSpecialCharacter()
    ]],

    confirmPassword: ['', Validators.required],

    pseudo: ['', [
      Validators.required, Validators.minLength(4),
    ]],

    username: ['', Validators.required],}, 
    
    { validator: passwordMatchValidator });

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {}

  get email() {
    return this.form.controls['email'];
  }
  get password() {
    return this.form.controls['password'];
  }
  get confirmPassword() {
    return this.form.controls['confirmPassword'];
  }
  get username() {
    return this.form.controls['username'];
  }
  get pseudo() {
    return this.form.controls['pseudo'];
  }

  nextStep() {
    this.errorMessage = null;
    if (this.currentStep < 2 && this.username.valid && this.pseudo.valid && this.email.valid) {
      this.currentStep++;
    } else {
      if (this.pseudo.touched && this.pseudo.invalid) {
        this.errorMessage = 'Pseudo invalide (4 caractères minimum)';
      }
      this.username.markAsTouched();
      this.pseudo.markAsTouched();
      this.email.markAsTouched();
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    } else {
      this.router.navigate(['/login']);
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const formValue: User = this.form.value as User;
      this.userService.createUser(formValue).subscribe({
        next: (response) => {
          console.log('Inscription réussie', response);
          this.router.navigate(['/login']);
        },
        error: (error) => {
          if (error.status === 400) {
            this.errorMessage = "Pseudo déjà utilisé";
          } else {
            this.errorMessage = 'Échec de l\'inscription';
          }
        }
      });
    } else {
      this.password.markAsTouched();
      this.confirmPassword.markAsTouched();
    }
  }
}