import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { TokenService } from './../services/token.service';

/**
 * Guard para comprobar que el usuario no esté loggeado
 */
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private tokenService: TokenService) {}

  /**
   * Para usar el guard se usa en la ruta especifica en la cual se quiera aplicar.
   *
   * Se agrega el guard en la ruta en el modulo router especifico
   *
   * @param route Ruta que recibe
   * @param state Snapshot del router en el momento en que recibe la ruta
   */
  canActivate() {
    const token = this.tokenService.getToken();
    if (token !== null) {
      return true;
    } else {
      // not logged in so redirect to login page with the return url
      this.router.navigate(['/login']);
      return false;
    }
  }
}
