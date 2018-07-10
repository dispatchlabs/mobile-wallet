import {Component, OnDestroy, OnInit} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {HomePage} from '../home/home';
import {AppService} from '../../app/app.service';
import {Config} from '../../store/states/config';
import {Observable} from 'rxjs/Observable';
import {AppState} from '../../app/app.state';
import {Store} from '@ngrx/store';
import {KeyHelper} from '../../helpers/key-helper';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage implements OnInit, OnDestroy {

    /**
     * Class level-declarations
     */
    public configState: Observable<Config>;
    public config: Config;
    public configSubscription: any;
    public privateKey: string;
    public keyHelper = KeyHelper;
    public error: string;

    /**
     *
     * @param {NavController} navCtrl
     * @param {NavParams} navParams
     * @param {AppService} appService
     * @param {Store<AppState>} store
     */
    constructor(public navCtrl: NavController, public navParams: NavParams, private appService: AppService, private store: Store<AppState>) {
        this.configState = this.store.select('config');
        this.configSubscription = this.configState.subscribe((config: Config) => {
            this.config = config;
        });
    }

    /**
     *
     */
    ngOnInit() {
        if (this.config.defaultAccount) {
            this.navCtrl.setRoot(HomePage);
        }
    }

    /**
     *
     */
    ngOnDestroy() {
        this.configSubscription.unsubscribe();
    }

    /**
     *
     * @param {string} privateKey
     */
    public onPrivateKeyChange(privateKey: string): void {
        console.log(this.privateKey);
    }

    /**
     *
     * @param event
     */
    public onPaste(event: any): boolean {
        if (!/^[0-9a-fA-F]+$/.test(event.target.value)) {
            this.error = 'Invalid private key';
            return false;
        }
        this.error = null;
        return true;
    }

    /**
     *
     */
    public next(): void {
        this.appService.generateNewAccount();
        this.navCtrl.setRoot(HomePage);
    }
}
