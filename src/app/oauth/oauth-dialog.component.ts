import {Component} from '@angular/core';
import {AuthService} from '../core/auth.service';

@Component({
  selector: 'dr-oauth-dialog',
  templateUrl: './oauth-dialog.component.html'
})
export class OauthDialogComponent {
  constructor(private auth: AuthService) {}

  signIn(): void {
    location.replace(this.auth.tokenRequestUrl);
  }
}
