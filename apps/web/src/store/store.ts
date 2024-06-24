import { configureStore } from '@reduxjs/toolkit';
import companyReducer from './reducers/companyReducer';

export const store = configureStore({
    reducer: {
        company: companyReducer,
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {company: CompanyState, user: UserState}
export type AppDispatch = typeof store.dispatch;
