import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { LOCAL_STORAGE, WINDOW } from '@ng-toolkit/universal';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor(
    @Inject(WINDOW) private window: Window,
    @Inject(LOCAL_STORAGE) private localStorage: any,
    private router: Router
  ) {}

  /**
   * Obtiene el token de autenticacion del local storage
   */
  getToken() {
    return this.localStorage.getItem('access_token');
  }
  /**
   * Da valor al token en el local storage
   * @param value valor del token
   */
  setToken(value: string) {
    this.localStorage.setItem('access_token', value);
  }
  /**
   * Elimina el token del local storage.
   * Al acceder a la llave retornará null
   */
  removeToken() {
    this.localStorage.removeItem('access_token');
  }

  /**
   * Chequeo de error
   * @param err el código de error de la petición
   */
  errorHandler(err) {
    if (err == 401 || err == 403) {
      this.router.navigate(['login']);
      this.removeToken();
    }
  }
}
