import {
  Injectable
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  firstValueFrom
} from 'rxjs';

import {
  environment
} from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl =
    environment.apiUrl;


  constructor(
    private http: HttpClient
  ) { }


  get<T>(
    endpoint: string
  ): Promise<T> {

    return firstValueFrom(
      this.http.get<T>(
        `${this.apiUrl}${endpoint}`
      )
    );

  }


  post<T>(
    endpoint: string,
    data: any
  ): Promise<T> {

    return firstValueFrom(
      this.http.post<T>(
        `${this.apiUrl}${endpoint}`,
        data
      )
    );

  }


  put<T>(
    endpoint: string,
    data: any
  ): Promise<T> {

    return firstValueFrom(
      this.http.put<T>(
        `${this.apiUrl}${endpoint}`,
        data
      )
    );

  }

  patch<T>(
    endpoint: string,
    data: any
  ): Promise<T> {

    return firstValueFrom(
      this.http.patch<T>(
        `${this.apiUrl}${endpoint}`,
        data
      )
    );

  }

  delete<T>(
    endpoint: string
  ): Promise<T> {

    return firstValueFrom(
      this.http.delete<T>(
        `${this.apiUrl}${endpoint}`
      )
    );

  }

}