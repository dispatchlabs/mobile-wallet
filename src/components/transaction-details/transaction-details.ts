import {Component, Input} from '@angular/core';

/**
 * Generated class for the TransactionDetailsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
    selector: 'transaction-details',
    templateUrl: 'transaction-details.html'
})
export class TransactionDetailsComponent {

    /**
     *
     */
    @Input()
    public transaction: any;
    @Input()
    public sent = true;

    /**
     *
     */
    constructor() {
    }

    /**
     *
     * @param {number} time
     * @returns {string}
     */
    public getDate(time: number): string {
        return (new Date(time)).toLocaleDateString() + ' ' + (new Date(time)).toLocaleTimeString();
    }
}
