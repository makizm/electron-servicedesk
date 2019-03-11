import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ElectronService } from 'ngx-electron';

@Injectable()
export class ServiceDeskService {

  public isElectronApp: boolean = false;

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
        if(err) console.error("Unable to open url: " + url)
      })
  }

  isLoggedIn(): boolean {
    return false;
  }

  login(username: string, password: string) {
    const login = {
        username: username,
        password: password
    }

    if(this.isElectronApp) {
      this.es.ipcRenderer.on("login-response", (event, arg) => {
        console.log('Event', event);
        console.log('Arg', arg);
      })
  
      this.es.ipcRenderer.send("login", login);
    } else {
      this.http.post('/api/auth', login)
        .subscribe(res => console.log('Response', res))
    }
  }
}
