import { TokenService } from './../services/token.service';
import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

@Injectable({ providedIn: 'root' })
export class LoginGuard implements CanActivate {
  constructor(private router: Router, private tokenService: TokenService) {}

  /**
   * Activa este guard usando [LoginGuard]{} en la ruta donde quieras usarlo.
   *
   * Este guard revisa si existe el token en el local storage, en caso de existir redirige al dashboard.
   *
   * Este guard es usado para evitar que un usuario loggeado acceda al login.
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const token = this.tokenService.getToken();
    if (token != null) {
      // if(this.tokenService.isUserSuperAdmin()){
      //     this.router.navigate(['/admin']);
      // }else{
      //     this.router.navigate(['/dashboard']);
      // }
      this.router.navigate(['/dashboard']);
      return false;
    }
    return true;
  }
}
