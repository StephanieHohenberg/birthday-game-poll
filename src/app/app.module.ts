import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {MatToolbarModule} from '@angular/material/toolbar';
import {TranslateLoader, TranslateModule, TranslatePipe, TranslateService} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {MatButtonModule} from '@angular/material/button';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatRippleModule} from '@angular/material/core';
import {AngularFireModule} from '@angular/fire';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {environment} from '../environments/environment';
import {RouletteWheelComponent} from './components/game/roulette-wheel/roulette-wheel.component';
import {PollFormComponent} from './components/poll-form/poll-form.component';
import {GameComponent} from './components/game/game.component';
import {ROUTES_CONFIG} from './app.routes';
import {RouterModule} from '@angular/router';
import {GameEventsConsoleComponent} from './components/game/game-events-console/game-events-console.component';
import {GameSessionService} from './services/game-session.service';
import {IdeaHttpService} from './services/idea-http.service';
import {PartyAnimalService} from './services/party-animal.service';
import {MatDialogModule} from '@angular/material/dialog';
import {CardDeskComponent} from './components/game/card-desk/card-desk.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {RegistrationDialogComponent} from './components/dialogs/registration-dialog/registration-dialog.component';
import {DisplayCardDialogComponent} from './components/dialogs/display-card-dialog/display-card-dialog.component';
import {MatSliderModule} from '@angular/material/slider';
import {AdminToolsComponent} from './components/game/admin-tools/admin-tools.component';
import {DrinkingCommandDialogComponent} from './components/dialogs/drinking-command-dialog/drinking-command-dialog.component';
import {LanguageToggleComponent} from './components/language-toggle/language-toggle.component';
import {DrinkNotificationDialogComponent} from './components/dialogs/drink-notification-dialog/drink-notification-dialog.component';

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    RouletteWheelComponent,
    PollFormComponent,
    GameComponent,
    GameEventsConsoleComponent,
    RegistrationDialogComponent,
    CardDeskComponent,
    DisplayCardDialogComponent,
    DrinkingCommandDialogComponent,
    AdminToolsComponent,
    AdminToolsComponent,
    LanguageToggleComponent,
    DrinkNotificationDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES_CONFIG),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    // Firebase Modules
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    // Bootstrap Modules
    NgbModule,
    // Angular Material Modules:
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatRippleModule,
    MatDialogModule,
    MatProgressBarModule,
    MatSliderModule,
  ],
  providers: [
    GameSessionService,
    IdeaHttpService,
    PartyAnimalService,
    TranslateService,
    TranslatePipe
  ],
  entryComponents: [
    RegistrationDialogComponent,
    DrinkingCommandDialogComponent,
    DrinkNotificationDialogComponent,
    DisplayCardDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
