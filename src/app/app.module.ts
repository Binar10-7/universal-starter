import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TransferHttpCacheModule } from '@nguniversal/common';
import {
  HttpClientModule,
  HttpClient,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { NgtUniversalModule } from '@ng-toolkit/universal';
// import { MetaModule } from '@ngx-meta/core';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-universal-desmystified' }),
    AppRoutingModule,
    TransferHttpCacheModule,
    HttpClientModule,
    NgtUniversalModule,
    CoreModule,
    SharedModule,
    // MetaModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
