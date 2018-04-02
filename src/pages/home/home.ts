import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    constructor(public navCtrl: NavController) {

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

}
