import {Transaction} from './transaction';
import {Account} from './account';

/**
 * Config
 */
export interface Config {

    /**
     * Interface level-declarations.
     */
    seedNodeIp: string;
    defaultAccount: Account;
    accounts: Account[];
    transactions: Transaction[];
}
