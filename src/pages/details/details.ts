import {Component, Input} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Transaction} from '../../store/states/transaction';

/**
 * Generated class for the DetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-details',
    templateUrl: 'details.html',
})
export class DetailsPage {

    @Input()
    public transaction: Transaction;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
        console.log(this.transaction)
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad DetailsPage');
    }

}
