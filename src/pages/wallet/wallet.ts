import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {Observable} from 'rxjs/Observable';
import {Config} from '../../store/states/config';
import {Store} from '@ngrx/store';
import {AppState} from '../../app/app.state';
import * as keccak from 'keccak';
import * as secp256k1 from 'secp256k1';
import {Account} from '../../store/states/account';
import {ConfigAction} from '../../store/redcuers/config.reducer';
import {AppService} from '../../app/app.service';

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
    public disclaimer = true;

    /**
     *
     * @param {NavController} navCtrl
     * @param {NavParams} navParams
     * @param {Store<AppState>} store
     * @param {ToastController} toastController
     * @param {AppService} appService
     */
    constructor(public navCtrl: NavController, public navParams: NavParams, private store: Store<AppState>, public toastController: ToastController, private appService: AppService) {
        this.configState = this.store.select('config');
        this.configSubscription = this.configState.subscribe((config: Config) => {
            this.config = config;
            this.selectedAddress = this.config.defaultAccount.address;
        });
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
        this.appService.generateNewAccount();
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
        this.walletInfo.nativeElement.select();
        document.execCommand('Copy');
        let toast = this.toastController.create({
            message: 'Copied to clipboard!',
            duration: 3000,
            position: 'top'
        });

        toast.onDidDismiss(() => {
            console.log('Dismissed toast');
        });

        toast.present();
    }

    /**
     *
     * @returns {string}
     */
    public getWalletInfoText(): string {
        let text = 'Private Key:\n' + this.config.defaultAccount.privateKey + ',\n\n' +
            'Address:\n' + this.config.defaultAccount.address;
        return text;

    }
}
