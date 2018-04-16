import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavController} from 'ionic-angular';
import {APP_REFRESH, AppService} from '../../app/app.service';
import {Observable} from 'rxjs/Observable';
import {Config} from '../../store/states/config';
import {AppState} from '../../app/app.state';
import {Store} from '@ngrx/store';
import {Transaction} from '../../store/states/transaction';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage implements OnInit, OnDestroy {

    /**
     * Class level-declarations.
     */
    public configState: Observable<Config>;
    public config: Config;
    public configSubscription: any;
    public balance: number;
    public fromTransctions: Transaction[];
    public toTransactions: Transaction[];
    public viewSent = false;
    public appEventSubscription: any;

    /**
     *
     * @param {NavController} navCtrl
     * @param {Store<AppState>} store
     * @param {AppService} appService
     */
    constructor(public navCtrl: NavController, private store: Store<AppState>, private appService: AppService) {
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
    }

    /**
     *
     */
    public refresh(): void {
        this.appService.get('http://' + this.config.seedNodeIp + ':1975/v1/transactions/from/' + this.config.defaultAccount.address).subscribe(response => {
            this.fromTransctions = response.data;
        });
        this.appService.get('http://' + this.config.seedNodeIp + ':1975/v1/transactions/to/' + this.config.defaultAccount.address).subscribe(response => {
            this.toTransactions = response.data;
        });
        this.appService.get('http://' + this.config.seedNodeIp + ':1975/v1/accounts/' + this.config.defaultAccount.address).subscribe(response => {
            if (response.status === 'OK') {
                this.balance = response.data.balance;
            }
        });
    }

    /**
     *
     */
    sendTokens() {
        this.navCtrl.push('SendTokensPage');
    }

    /**
     *
     */
    transactionDetails() {
        this.navCtrl.push('DetailsPage');
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
        this.appEventSubscription.unsubscribe();
    }
}
