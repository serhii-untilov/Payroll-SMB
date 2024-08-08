import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import companyReducer from './slices/companySlice';
import payPeriodReducer from './slices/payPeriodSlice';
import compactViewReducer from './slices/compactViewSlice';
import themeReducer from './slices/themeSlice';
import themeModeReducer from './slices/themeModeSlice';
import serverEventReducer from './slices/serverEventSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        company: companyReducer,
        payPeriod: payPeriodReducer,
        compactView: compactViewReducer,
        themeMode: themeModeReducer,
        theme: themeReducer,
        serverEvent: serverEventReducer,
    },
});

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {user: UserState, company: CompanyState, payPeriod: PayPeriodState}
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
