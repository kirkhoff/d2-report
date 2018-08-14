import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from './material.module';
import {HeaderComponent} from './header/header.component';
import {RouterModule, Routes} from '@angular/router';
import {CrucibleComponent} from './crucible/crucible.component';
import {CrucibleOverviewComponent} from './crucible/crucible-overview/crucible-overview.component';
import {CompetitiveComponent} from './crucible/competitive/competitive.component';

const routes: Routes = [
  {
    path: 'crucible',
    component: CrucibleComponent,
    children: [
      {
        path: '',
        component: CrucibleOverviewComponent
      },
      {
        path: 'competitive',
        component: CompetitiveComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/crucible'
  }
];

@NgModule({
  declarations: [
    AppComponent,
    CompetitiveComponent,
    CrucibleComponent,
    CrucibleOverviewComponent,
    HeaderComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    MaterialModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
