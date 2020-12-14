import { TokenService } from './../services/token.service';
import { Inject } from '@angular/core';
import { Injectable, OnDestroy } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpClient,
} from '@angular/common/http';
import { Observable, throwError, Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';

// LocalStorage y Window - Universal - Nodejs side
import { LOCAL_STORAGE, WINDOW } from '@ng-toolkit/universal';
import { isNullOrUndefined } from 'util';

export const DEFAULT_HEADERS = 'DEFAULT_HEADERS';
export const WebClient = 'WebClient';
export const Dashboard = 'Dashboard';
export const Tiresia = 'Tiresia';
export const Files = 'Files';
export const PDF = 'PDF';

@Injectable()
export class TokenInterceptor implements HttpInterceptor, OnDestroy {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();

  token: string;
  lang: string;
  intentos = 0;

  constructor(
    private tokenService: TokenService,
    @Inject(LOCAL_STORAGE) private localStorage: any,
    private _http: HttpClient
  ) {}

  ngOnDestroy(): void {
    // This aborts all HTTP requests.
    this.ngUnsubscribe.next();
    // This completes the subject properlly.
    this.ngUnsubscribe.complete();
  }

  /**
   * Trae el token del localstorage
   */
  getToken() {
    return this.tokenService.getToken();
  }

  /**
   * Trae el idioma
   */
  getLang() {
    if (isNullOrUndefined(this.localStorage.getItem('lang'))) {
      this.localStorage.setItem('lang', '1');
    }
    return this.localStorage.getItem('lang');
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Asignación del token
    this.token = this.getToken();
    // Asignacion de idioma
    this.lang = this.getLang();

    if (request.headers.has(WebClient)) {
      // console.log('Estoy usando los headers webclient');
      /**
       * Headers para el sitio web
       */
      return next
        .handle(
          request.clone({
            setHeaders: {
              'Cache-Control': 'no-cache',
              Pragma: 'no-cache',
              Accept: 'application/json',
              'Content-Type': 'application/json',
              // public key
              'client-key': 'W3mZL6jT93GrgrCT',
              'language-key': this.lang,
            },
          })
        )
        .pipe(
          catchError((error: HttpErrorResponse) => {
            // Con auth
            if (this.intentos == 0) {
              // this.envioErrorConAuth(error);
            }
            this.intentos++;
            return throwError(error);
          })
        );
    } else if (request.headers.has(Dashboard)) {
      /**
       * Dashboard
       */
      console.log('Estoy usando los headers dashboard');
      request = request.clone({
        setHeaders: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          Authorization: 'Bearer ' + this.token,
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'language-key': this.lang,
        },
      });

      // console.log(request);

      return next.handle(request).pipe(
        catchError((error: HttpErrorResponse) => {
          // Con auth
          if (this.intentos == 0) {
            // this.envioErrorConAuth(error);
          }
          this.intentos++;
          return throwError(error);
        })
      );
    } else if (request.headers.has(DEFAULT_HEADERS)) {
      /**
       * DEFAULT_HEADERS
       * Sin idioma, de ser necesario setearlo por otros medios
       */
      console.log('Estoy usando los headers default');
      request = request.clone({
        setHeaders: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          Authorization: 'Bearer ' + this.token,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      // console.log(request);

      return next.handle(request).pipe(
        catchError((error: HttpErrorResponse) => {
          // Con auth
          if (this.intentos == 0) {
            // this.envioErrorConAuth(error);
          }
          this.intentos++;
          return throwError(error);
        })
      );
    } else if (request.headers.has(Tiresia)) {
      /**
       * Tiresia
       */
      // console.log('Usando headers tiresia');
      request = request.clone({
        setHeaders: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          Authorization: 'Bearer ' + this.token,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      return next.handle(request).pipe(
        catchError((error: HttpErrorResponse) => {
          // Con auth
          if (this.intentos == 0) {
            // this.envioErrorConAuth(error);
          }
          this.intentos++;
          return throwError(error);
        })
      );
    } else if (request.headers.has(Files)) {
      /**
       * Files
       */
      console.log('Usando headers Files');
      request = request.clone({
        setHeaders: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          Authorization: 'Bearer ' + this.token,
          // Lenguaje
          'language-key': this.lang,
        },
      });

      return next.handle(request).pipe(
        catchError((error: HttpErrorResponse) => {
          // Con auth
          if (this.intentos == 0) {
            // this.envioErrorConAuth(error);
          }
          this.intentos++;
          return throwError(error);
        })
      );
    } else if (request.headers.has(PDF)) {
      /**
       * PDF BLOB
       * Headers para descargar los PDF
       */
      // console.log('Usando headers PDF');
      request = request.clone({
        setHeaders: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          Authorization: 'Bearer ' + this.token,
          'Content-Type': 'application/pdf',
        },
      });

      return next.handle(request).pipe(
        catchError((error: HttpErrorResponse) => {
          // Con auth
          if (this.intentos == 0) {
            // this.envioErrorConAuth(error);
          }
          this.intentos++;
          return throwError(error);
        })
      );
    } else {
      /**
       * Lo que no tenga header aplicado
       *
       */
      // console.log('Usando headers defecto');
      request = request.clone({
        setHeaders: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          Authorization: 'Bearer ' + this.token,
          // GrantClient: environment._grantClient,
          Accept: 'application/json',
        },
      });

      return next.handle(request).pipe(
        catchError((error: HttpErrorResponse) => {
          // Sin auth
          if (this.intentos == 0) {
            // this.envioErrorSinAuth(error);
          }
          this.intentos++;
          return throwError(error);
        })
      );
    }
  }

  /**
   * Envía los errores a la base de datos cuando hay un usuario loggeado
   * @param error HTTP Error
   */
  // async envioErrorConAuth(error) {
  //   const body = {
  //     header: JSON.stringify(error.headers),
  //     body_error: JSON.stringify(error)
  //   };
  //   if (error.status == 0) {
  //     this._login.logOut();
  //   } else if (error.status !== 401) {
  //     await this._http
  //       .post(environment.error.envioConToken, body)
  //       .pipe(takeUntil(this.ngUnsubscribe))
  //       .subscribe(res => {
  //         // console.log(res);
  //       });
  //   } else {
  //     this._swal.showErrorNotification(
  //       'Por favor, intenta iniciar sesión de nuevo'
  //     );
  //   }
  // }

  /**
   * Envía el error en áreas donde no se esté utilizando token
   * o que los headers no posean nombre alguno
   * @param error HTTP Error
   */
  // async envioErrorSinAuth(error) {
  //   const body = {
  //     header: JSON.stringify(error.headers),
  //     body_error: JSON.stringify(error)
  //   };

  //   if (error.status !== 401) {
  //     await this._http
  //       .post(environment.error.envioSinToken, body)
  //       .pipe(takeUntil(this.ngUnsubscribe))
  //       .subscribe(res => console.log(res));
  //   }
  // }
}
