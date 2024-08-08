import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { PayPeriod } from '@repo/openapi';

// Define a type for the slice state
export interface PayPeriodState {
    value: PayPeriod | undefined;
}

// Define the initial state using that type
const initialState: PayPeriodState = {
    value: undefined,
};

export const payPeriodSlice = createSlice({
    name: 'payPeriod',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        // Use the PayloadAction type to declare the contents of `action.payload`
        setPayPeriod: (state, action: PayloadAction<PayPeriod | undefined>) => {
            state.value = action.payload;
        },
    },
});

export const { setPayPeriod } = payPeriodSlice.actions;
// Other code such as selectors can use the imported `RootState` type
export const selectPayPeriod = (state: RootState) => state.payPeriod.value;
export default payPeriodSlice.reducer;
