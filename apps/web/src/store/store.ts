import { configureStore } from '@reduxjs/toolkit';
import compactViewReducer from './slices/compactViewSlice';
import companyReducer from './slices/companySlice';
import payPeriodReducer from './slices/payPeriodSlice';
import serverEventReducer from './slices/serverEventSlice';
import themeModeReducer from './slices/themeModeSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types
                ignoredActions: ['your/action/type'],
                // Ignore these field paths in all actions
                ignoredActionPaths: ['payload'],
                // Ignore these paths in the state
                ignoredPaths: ['theme.value', 'company.value', 'payPeriod.value'],
            },
        }),
    reducer: {
        user: userReducer,
        company: companyReducer,
        payPeriod: payPeriodReducer,
        compactView: compactViewReducer,
        themeMode: themeModeReducer,
        serverEvent: serverEventReducer,
    },
});

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {user: UserState, company: CompanyState, payPeriod: PayPeriodState}
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
