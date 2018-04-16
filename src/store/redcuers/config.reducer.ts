import {Action} from '@ngrx/store';
import {Config} from '../states/config';
import {Account} from '../states/account';

/**
 *
 */
export class ConfigAction implements Action {

    /**
     * Class level-declarations.
     */
    public static CONFIG_INITIAL_STATE = 'CONFIG_INITIAL_STATE';
    public static CONFIG_UPDATE = 'CONFIG_UPDATE';
    public readonly type: string;
    public config: Config;

    /**
     *
     * @param {Config} state
     * @param {ConfigAction} action
     * @returns {any}
     */
    public static reducer(state: Config = ConfigAction.getInitialState(), action: ConfigAction) {
        switch (action.type) {
            case ConfigAction.CONFIG_INITIAL_STATE:
                return ConfigAction.getInitialState();
            case ConfigAction.CONFIG_UPDATE:
                return Object.assign({}, action.config);
            default:
                return state;
        }
    }

    /**
     *
     * @returns {Config}
     */
    public static getInitialState(): Config {
        const defaultAccount: Account = {
            address: '79db55dd1c8ae495c267bde617f7a9e5d5c67719',
            privateKey: 'e7181240095e27679bf38e8ad77d37bedb5865b569157b4c14cdb1bebb7c6e2b',
            balance: 0,
            name: 'Dispatch Labs'
        };
        return {
            seedNodeIp: 'mcgregor.io',
            defaultAccount: defaultAccount,
            accounts: [defaultAccount],
            transactions: null
        };
    }

    /**
     *
     * @param {string} type
     * @param {Config} config
     */
    constructor(type: string, config?: Config) {
        if (!this) {
            return;
        }
        this.type = type;
        this.config = config;
    }
}
