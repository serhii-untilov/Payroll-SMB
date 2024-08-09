import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { Company } from '@repo/openapi';

// Define a type for the slice state
export interface CompanyState {
    value: Company | null;
}

// Define the initial state using that type
const initialState: CompanyState = {
    value: null,
};

export const companySlice = createSlice({
    name: 'company',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        // Use the PayloadAction type to declare the contents of `action.payload`
        setCompany: (state, action: PayloadAction<Company | null>) => {
            state.value = action.payload;
        },
    },
});

export const { setCompany } = companySlice.actions;
// Other code such as selectors can use the imported `RootState` type
export const selectCompany = (state: RootState) => state.company.value;
export default companySlice.reducer;
