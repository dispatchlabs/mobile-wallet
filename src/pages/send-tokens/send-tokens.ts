import {Component, OnDestroy} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import * as keccak from 'keccak';
import * as secp256k1 from 'secp256k1';
import {Observable} from 'rxjs/Observable';
import {Config} from '../../store/states/config';
import {Store} from '@ngrx/store';
import {AppState} from '../../app/app.state';
import {APP_REFRESH, AppService} from '../../app/app.service';

declare const Buffer;

/**
 * Generated class for the SendTokensPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-send-tokens',
    templateUrl: 'send-tokens.html',
})
export class SendTokensPage implements OnDestroy {

    /**
     * Class level-declarations.
     */
    public configState: Observable<Config>;
    public config: Config;
    public configSubscription: any;
    public to = '43f603c04610c87326e88fcd24152406d23da032';
    public tokens: string;
    public id: string;

    /**
     *
     * @param {NavController} navCtrl
     * @param {NavParams} navParams
     * @param {AppService} appService
     * @param {Store<AppState>} store
     * @param {ToastController} toastController
     */
    constructor(public navCtrl: NavController, public navParams: NavParams, private appService: AppService, private store: Store<AppState>, private toastController: ToastController) {
        this.configState = this.store.select('config');
        this.configSubscription = this.configState.subscribe((config: Config) => {
            this.config = config;
        });
    }

    /**
     *
     */
    ionViewDidLoad() {
        console.log('ionViewDidLoad SendTokensPage');
    }

    /**
     *
     */
    ngOnDestroy() {
        this.configSubscription.unsubscribe();
    }

    /**
     *
     * @param {number} value
     * @returns {any}
     */
    private numberToBuffer(value: number): any {
        const bytes = [0, 0, 0, 0, 0, 0, 0, 0];
        for (let i = 0; i < bytes.length; i++) {
            const byte = value & 0xff;
            bytes [i] = byte;
            value = (value - byte) / 256;
        }
        return new Buffer(bytes);
    }

    /**
     *
     */
    public send(): void {
        const privateKey = this.config.defaultAccount.privateKey;
        const date = new Date();
        const type = new Buffer(1);
        type[0] = 0x00;
        const from = Buffer.from(this.config.defaultAccount.address, 'hex');
        const to = Buffer.from(this.to, 'hex');
        const tokens = this.numberToBuffer(parseInt(this.tokens, 10));
        const time = this.numberToBuffer(date.getTime());
        const hash = keccak('keccak256').update(Buffer.concat([type, from, to, tokens, time])).digest();
        const signature = secp256k1.sign(hash, Buffer.from(privateKey, 'hex'));
        const transaction = {
            hash: hash.toString('hex'),
            type: 0,
            from: from.toString('hex'),
            to: to.toString('hex'),
            value: parseInt(this.tokens, 10),
            time: date.getTime(),
            signature: new Buffer(signature.signature).toString('hex') + '00',
        };

        this.appService.post('http://' + this.config.seedNodeIp + '/v1/transactions', transaction).subscribe(response => {
            this.id = response.id;
            this.getStatus();
        });
    }

    /**
     *
     */
    private getStatus(): void {
        setTimeout(() => {
            this.appService.get('http://' + this.config.seedNodeIp + '/v1/statuses/' + this.id).subscribe(response => {
                if (response.status === 'Pending') {
                    this.getStatus();
                    return;
                }
                this.appService.appEvents.emit({type: APP_REFRESH});
                this.navCtrl.pop();
                let toast = this.toastController.create({
                    message: response.status === 'Ok' ? 'Tokens Sent' : response.status,
                    duration: 3000,
                    position: 'top'
                });
                toast.present();
            });
        }, 500);
    }
}
