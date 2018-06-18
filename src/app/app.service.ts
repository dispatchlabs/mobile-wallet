import {EventEmitter, Injectable, OnDestroy} from '@angular/core';
import {Http, RequestOptions, Headers} from '@angular/http';
import 'rxjs/add/operator/map'
import {Account} from '../store/states/account';
import {ConfigAction} from '../store/redcuers/config.reducer';
import * as keccak from 'keccak';
import * as secp256k1 from 'secp256k1';
import {Store} from '@ngrx/store';
import {AppState} from './app.state';
import {Observable} from 'rxjs/Observable';
import {Config} from '../store/states/config';

declare const Buffer;

/**
 * Events
 */
export const APP_CLEAR_ALL_STATES = 'APP_CLEAR_ALL_STATES';
export const APP_REFRESH = 'APP_REFRESH';

/**
 *
 */
@Injectable()
export class AppService implements OnDestroy {

    /**
     * Class level-declarations.
     */
    public appEvents = new EventEmitter<any>();
    public configState: Observable<Config>;
    public config: Config;
    public configSubscription: any;

    /**
     *
     * @param {Http} http
     * @param {Store<AppState>} store
     */
    constructor(private http: Http, private store: Store<AppState>) {
        this.configState = this.store.select('config');
        this.configSubscription = this.configState.subscribe((config: Config) => {
            this.config = config;
        });
    }

    /**
     *
     */
    ngOnDestroy() {
        this.configSubscription.unsubscribe();
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

    /**
     *
     */
    public generateNewAccount(): void {
        const privateKey = new Buffer(32);
        do {
            crypto.getRandomValues(privateKey);
        } while (!secp256k1.privateKeyVerify(privateKey));
        const publicKey = secp256k1.publicKeyCreate(privateKey, false);

        const account: Account = {
            address: Buffer.from(this.toAddress(publicKey)).toString('hex'),
            privateKey: Buffer.from(privateKey).toString('hex'),
            balance: 0,
            name: 'New Wallet'
        };

        this.config.defaultAccount = account;
        this.config.accounts.push(account);
        this.store.dispatch(new ConfigAction(ConfigAction.CONFIG_UPDATE, this.config));
    }

    /**
     *
     * @param publicKey
     * @returns {any}
     */
    public toAddress(publicKey: any): any {

        // Hash publicKey.
        const hashablePublicKey = new Buffer(publicKey.length-1);
        for (let i = 0; i < hashablePublicKey.length; i++) {
            hashablePublicKey[i] = publicKey[i+1];
        }
        const hash = keccak('keccak256').update(hashablePublicKey).digest();

        // Create address.
        const address = new Buffer(20);
        for (let i = 0; i < address.length; i++) {
            address[i] = hash[i + 12];
        }
        return address;
    }
}
