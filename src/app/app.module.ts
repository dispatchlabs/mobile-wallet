import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';

import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {LoginPage} from '../pages/login/login';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {WalletPage} from '../pages/wallet/wallet';
import {APP_CLEAR_ALL_STATES, AppService} from './app.service';
import {ActionReducer, ActionReducerMap, MetaReducer, StoreModule} from '@ngrx/store';
import {AppState} from './app.state';
import {ConfigAction} from '../store/redcuers/config.reducer';
import {HttpModule} from '@angular/http';
import {Clipboard} from '@ionic-native/clipboard';

export const KEY = 'df2380f2-f131-4c80-9dc0-eababfdf0d71';

/**
 * reducers
 */
const reducers: ActionReducerMap<AppState> = {
    config: ConfigAction.reducer
};

/**
 *
 * @param {ActionReducer<AppState>} reducer
 * @returns {ActionReducer<AppState>}
 */
export function localStorageReducer(reducer: ActionReducer<any>): ActionReducer<any> {
    return function (state: AppState, action: any): AppState {
        if (typeof localStorage !== 'undefined') {
            if (action.type === '@ngrx/store/init') {
                return reducer(Object.assign({}, JSON.parse(localStorage.getItem(KEY))), action);
            } else if (action.type === APP_CLEAR_ALL_STATES) {
                return reducer(Object.create({}), action);
            }
            localStorage.setItem(KEY, JSON.stringify(state));
        }
        return reducer(state, action);
    };
}

const metaReducers: MetaReducer<AppState>[] = [localStorageReducer];

@NgModule({
    declarations: [
        MyApp,
        HomePage,
        LoginPage,
        WalletPage,
    ],
    imports: [
        BrowserModule,
        HttpModule,
        IonicModule.forRoot(MyApp),
        // NGRX
        StoreModule.forRoot(reducers, {metaReducers}),
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage,
        LoginPage,
        WalletPage,
    ],
    providers: [
        StatusBar,
        SplashScreen,
        AppService,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        Clipboard
    ]
})
export class AppModule {
}
