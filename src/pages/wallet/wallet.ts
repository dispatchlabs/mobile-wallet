import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Observable} from 'rxjs/Observable';
import {Config} from '../../store/states/config';
import {Store} from '@ngrx/store';
import {AppState} from '../../app/app.state';
import * as keccak from 'keccak';
import * as secp256k1 from 'secp256k1';
import {Account} from '../../store/states/account';
import {ConfigAction} from '../../store/redcuers/config.reducer';
import {Clipboard} from '@ionic-native/clipboard';

declare const Buffer;

/**
 * Generated class for the WalletPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-wallet',
    templateUrl: 'wallet.html',
})
export class WalletPage implements OnInit, OnDestroy {

    /**
     * Class level-declarations.
     */
    public configState: Observable<Config>;
    public config: Config;
    public configSubscription: any;
    @ViewChild('walletInfo')
    public walletInfo: any;
    public selectedAddress: string;

    /**
     *
     * @param {NavController} navCtrl
     * @param {NavParams} navParams
     * @param {Store<AppState>} store
     */
    constructor(public navCtrl: NavController, public navParams: NavParams, private store: Store<AppState>, private clipboard: Clipboard) {
        this.configState = this.store.select('config');
        this.configSubscription = this.configState.subscribe((config: Config) => {
            this.config = config;
            this.selectedAddress = this.config.defaultAccount.address;
        });
    }

    /**
     *
     */
    ionViewDidLoad() {
        console.log('ionViewDidLoad WalletPage');
    }

    /**
     *
     */
    ngOnInit() {
    }

    /**
     *
     */
    ngOnDestroy() {
        this.configSubscription.unsubscribe();
    }

    /**
     *
     */
    public generateNewAccount(): void {
        const privateKey = new Buffer(32);
        do {
            crypto.getRandomValues(privateKey);
        } while (!secp256k1.privateKeyVerify(privateKey));
        const publicKey = secp256k1.publicKeyCreate(privateKey);
        const hash = keccak('keccak256').update(publicKey).digest();
        const address = new Buffer(20);
        for (let i = 0; i < address.length; i++) {
            address[i] = hash[i + 12];
        }

        const account: Account = {
            address: Buffer.from(address).toString('hex'),
            privateKey: Buffer.from(privateKey).toString('hex'),
            balance: 0,
            name: ''
        };
        this.config.accounts.push(account);
        this.store.dispatch(new ConfigAction(ConfigAction.CONFIG_UPDATE, this.config));
    }

    /**
     *
     * @param {string} name
     */
    public onNameChange(name: string): void {
        this.config.defaultAccount.name = name;
        this.store.dispatch(new ConfigAction(ConfigAction.CONFIG_UPDATE, this.config));
    }

    /**
     *
     * @param {string} address
     */
    public onAccountChange(address: string): void {
       for (let account of this.config.accounts) {
           if (account.address === address) {
               this.config.defaultAccount = account;
               this.store.dispatch(new ConfigAction(ConfigAction.CONFIG_UPDATE, this.config));
           }
       }
    }

    /**
     *
     */
    public copyToClipboard() {
        this.clipboard.copy(this.config.defaultAccount.address)
    }
}
