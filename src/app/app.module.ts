import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {CoreModule} from './core/core.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from './material.module';
import {RouterModule, Routes} from '@angular/router';
import {CrucibleComponent} from './crucible/crucible.component';
import {CrucibleOverviewComponent} from './crucible/crucible-overview/crucible-overview.component';
import {CompetitiveComponent} from './crucible/competitive/competitive.component';
import {FireteamComponent} from './fireteam/fireteam.component';
import {MomentModule} from 'ngx-moment';
import {SharedModule} from './shared/shared.module';
import {GetBigComponent} from './get-big/get-big.component';
import {SearchComponent} from './search/search.component';
import {CharacterComponent} from './character/character.component';
import {OauthComponent} from './oauth/oauth.component';
import {OauthDialogComponent} from './oauth/oauth-dialog.component';

const routes: Routes = [
  {
    path: 'oauth',
    component: OauthComponent
  },
  {
    path: 'big',
    component: GetBigComponent,
    data: {
      title: 'Get Big Quick'
    }
  },
  {
    path: 'crucible',
    component: CrucibleComponent,
    data: {
      title: 'Crucible'
    },
    children: [
      {
        path: '',
        component: CrucibleOverviewComponent,
        data: {
          title: 'Guardian Overview'
        }
      },
      {
        path: 'competitive',
        component: CompetitiveComponent,
        data: {
          title: 'Fireteam Report'
        }
      }
    ]
  },
  {
    path: 'fireteam',
    component: FireteamComponent
  },
  {
    path: '**',
    redirectTo: '/big'
  }
];

@NgModule({
  declarations: [
    AppComponent,
    CharacterComponent,
    CompetitiveComponent,
    CrucibleComponent,
    CrucibleOverviewComponent,
    FireteamComponent,
    GetBigComponent,
    OauthComponent,
    OauthDialogComponent,
    SearchComponent
  ],
  entryComponents: [
    OauthDialogComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    SharedModule,
    MaterialModule,
    MomentModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
