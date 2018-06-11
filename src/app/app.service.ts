import {EventEmitter, Injectable} from '@angular/core';
import {Http, RequestOptions, Headers} from '@angular/http';
import 'rxjs/add/operator/map'

/**
 * Events
 */
export const APP_CLEAR_ALL_STATES = 'APP_CLEAR_ALL_STATES';
export const APP_REFRESH = 'APP_REFRESH';

/**
 *
 */
@Injectable()
export class AppService {

    /**
     * Class level-declarations.
     */
    public appEvents = new EventEmitter<any>();

    /**
     *
     * @param {Http} http
     */
    constructor(private http: Http) {
    }

    /**
     *
     * @param {string} url
     * @returns {Observable<any>}
     */
    public get(url: string): any {
        const headers = new Headers({'Content-Type': 'application/json'});
        const requestOptions = new RequestOptions({headers: headers});
        return this.http.get(url, requestOptions).map(response => response.json());
    }

    /**
     *
     * @param {string} url
     * @param json
     * @returns {any}
     */
    public post(url: string, json: any): any {
        const headers = new Headers({'Content-Type': 'application/json'});
        const requestOptions = new RequestOptions({headers: headers});
        return this.http.post(url, JSON.stringify(json), requestOptions).map(response => response.json());
    }
}