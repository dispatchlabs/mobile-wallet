import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavController} from 'ionic-angular';
import {AppService} from '../../app/app.service';
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
    public fromTransctions: Transaction[];
    public toTransactions: Transaction[];
    public viewSent = false;

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
        this.getFromTransaction();
       this.getToTransaction();
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
    public getFromTransaction() {
        this.appService.get('http://' + this.config.seedNodeIp + ':1975/v1/transactions/from/' + this.config.defaultAccount.address).subscribe(response => {
            this.fromTransctions = response.data;


        });
    }

    /**
     *
     */
    public getToTransaction() {
        this.appService.get('http://' + this.config.seedNodeIp + ':1975/v1/transactions/to/' + this.config.defaultAccount.address).subscribe(response => {
            this.toTransactions = response.data;
        });
    }
}
