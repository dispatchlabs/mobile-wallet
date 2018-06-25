import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Content, NavController} from 'ionic-angular';
import {APP_REFRESH, AppService} from '../../app/app.service';
import {Observable} from 'rxjs/Observable';
import {Config} from '../../store/states/config';
import {AppState} from '../../app/app.state';
import {Store} from '@ngrx/store';
import {Transaction} from '../../store/states/transaction';
import {InAppBrowser, InAppBrowserOptions} from '@ionic-native/in-app-browser';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html',
})
export class HomePage implements OnInit, OnDestroy {

    public options : InAppBrowserOptions = {
        location : 'yes',
        hidden : 'no', //Or  'yes'
        clearcache : 'yes',
        clearsessioncache : 'yes',
        zoom : 'yes',//Android only ,shows browser zoom controls
        hardwareback : 'yes',
        mediaPlaybackRequiresUserAction : 'no',
        shouldPauseOnSuspend : 'no', //Android only
        closebuttoncaption : 'Close', //iOS only
        disallowoverscroll : 'no', //iOS only
        toolbar : 'yes', //iOS only
        enableViewportScale : 'no', //iOS only
        allowInlineMediaPlayback : 'no',//iOS only
        presentationstyle : 'pagesheet',//iOS only
        fullscreen : 'yes',//Windows only
    };

    /**
     * Class level-declarations.
     */
    public configState: Observable<Config>;
    public config: Config;
    public configSubscription: any;
    public balance: number;
    public fromTransactions: Transaction[];
    public toTransactions: Transaction[];
    public appEventSubscription: any;
    public transaction: Transaction;
    public displaySection: string;
    public transactionType: string;
    public currentTransactionHash: string;
    public value = 25000.83;
    public url: string;
    @ViewChild(Content) content: Content;

    /**
     *
     * @param {NavController} navCtrl
     * @param {Store<AppState>} store
     * @param {AppService} appService
     */
    constructor(public navCtrl: NavController, private store: Store<AppState>, private appService: AppService, public inAppBrowser: InAppBrowser) {
        this.configState = this.store.select('config');
        this.configSubscription = this.configState.subscribe((config: Config) => {
            this.config = config;
            this.refresh();
        });
        this.appEventSubscription = this.appService.appEvents.subscribe((event: any) => {
            switch (event.type) {
                case APP_REFRESH:
                    this.refresh();
                    return;
            }
        });
        this.displaySection = 'transactionsSection';
        this.transactionType = 'all';
    }


    /**
     *
     */
    ngOnInit() {
        this.content.resize();
    }

    /**
     *
     */
    ngOnDestroy() {
        this.configSubscription.unsubscribe();
        this.appEventSubscription.unsubscribe();
    }

    /**
     *
     */
    public refresh(): void {
        this.appService.get('http://' + this.config.seedNodeIp + '/v1/transactions/from/' + this.config.defaultAccount.address).subscribe(response => {
            this.fromTransactions = response.data;
        });
        this.appService.get('http://' + this.config.seedNodeIp + '/v1/transactions/to/' + this.config.defaultAccount.address).subscribe(response => {
            this.toTransactions = response.data;
        });
        this.appService.get('http://' + this.config.seedNodeIp + '/v1/accounts/' + this.config.defaultAccount.address).subscribe(response => {
            if (response.status === 'Ok') {
                this.balance = response.data.balance;
            }
        });
    }

    /**
     *
     * @param {number} time
     * @returns {string}
     */
    public getDate(time: number): string {
        const date = (new Date(time)).toLocaleDateString();
        return date;
    }

    /**
     *
     * @param {Transaction} transaction
     */
    public sendTokens(transaction: Transaction) {
        this.navCtrl.push('SendTokensPage');
    }

    /**
     *
     * @param {Transaction} transaction
     */
    public onDetailsClicked(transaction: Transaction): void {
        if (transaction.hash === this.currentTransactionHash) {
            this.currentTransactionHash = null;
        } else {
            this.currentTransactionHash = transaction.hash;
        }
    }

    /**
     *
     */
    public openLink(url: string) {
        this.inAppBrowser.create(url,'_blank');
    }

}
