import {Component, ViewChild} from '@angular/core';
import {Nav, Platform, ToastController} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {ScreenOrientation} from '@ionic-native/screen-orientation';

import {HomePage} from '../pages/home/home';
import {WalletPage} from '../pages/wallet/wallet';
import {LoginPage} from '../pages/login/login';
import {Observable} from 'rxjs/Observable';
import {Config} from '../store/states/config';
import {AppState} from './app.state';
import {Store} from '@ngrx/store';
import {Account} from '../store/states/account';
import {ConfigAction} from '../store/redcuers/config.reducer';
import * as keccak from 'keccak';
import * as secp256k1 from 'secp256k1';

declare const Buffer;

@Component({
    templateUrl: 'app.html',
    providers: [
        ScreenOrientation
    ]

})
export class MyApp {

    /**
     * Class Level Declarations
     */
    @ViewChild(Nav) nav: Nav;
    public configState: Observable<Config>;
    public config: Config;
    public configSubscription: any;
    @ViewChild('walletInfo')
    public walletInfo: any;
    public selectedAddress: string;
    public disclaimer = true;

    rootPage: any = LoginPage;

    pages: Array<{ title: string, component: any }>;

    constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public screenOrientation: ScreenOrientation, private store: Store<AppState>,  public toastController: ToastController) {
        this.initializeApp();

        // used for an example of ngFor and navigation
        this.pages = [
            {title: 'Home', component: HomePage},
            {title: 'Wallet', component: WalletPage},
        ];

        this.configState = this.store.select('config');
        this.configSubscription = this.configState.subscribe((config: Config) => {
            this.config = config;
            this.selectedAddress = this.config.defaultAccount.address;
        });

        // lock screen orientation to portrait, comment out for browser testing
        // this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

        this.statusBar.styleLightContent();

    }

    initializeApp() {
        this.platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            // Set orientation to portrait
            // this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }

    openPage(page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.nav.setRoot(page.component);
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
            name: 'New Wallet'
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
        let text =
            'Wallet Name:\n' + this.config.defaultAccount.name + '\n\n' +
            'Private Key:\n' + this.config.defaultAccount.privateKey + '\n\n' +
            'Address:\n' + this.config.defaultAccount.address;
        return text;

    }
}
