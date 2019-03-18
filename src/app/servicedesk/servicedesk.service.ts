import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { ElectronService } from 'ngx-electron';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

interface BasicResponse {
  success: boolean;
  messages?: any;
}

@Injectable()
export class ServiceDeskService {

  isElectronApp: boolean = false;

  protected authHeader: HttpHeaders;

  constructor(private es: ElectronService, private http: HttpClient) {
    this.isElectronApp = this.es.isElectronApp;
  }

  /**
     * Open external browser window to provided URL
     * @param url
     * @example openExternal("https://www.google.com")
     */
    openExternal(url: string) {
      this.es.shell.openExternal(url, null, (err) => {
        if(err) console.error("Unable to open url: " + url);
      })
  }

  isLoggedIn(): Observable<{ success: boolean }> {
    const response = new Subject<{ success: boolean }>();

    this.http.get('/api/auth', { headers: this.authHeader })
      .subscribe(
        res => response.next({ success: res['success'] }),
        err => response.next({ success: false })
      )

    return response.asObservable();
  }

  private storeAuthData(data: any) {
    // localStorage.setItem(key, JSON.stringify(myObj));
    console.log('Auth Data', data['setCookie']);
    console.log('Auth Data type', typeof data['setCookie']);
  }

  login(username: string, password: string): Observable<{ success: boolean }> {
    const login = {
        username: username,
        password: password
    }

    const response = new Subject<{ success: boolean }>();

    if(this.isElectronApp) {
      this.es.ipcRenderer.on("auth-response", (event, arg) => {
        console.log('Event', event);
        console.log('Arg', arg);
      })
      this.es.ipcRenderer.send("auth", login);
    } else {
      this.http.post('/api/auth', login, { withCredentials: true })
        .pipe(tap(res => this.storeAuthData(res['messages'])))
        .subscribe(
          res => response.next({ success: res['success'] }),
          err => response.next({ success: false })
        )
    }

    return response.asObservable();
  }
}
