import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './../store';
import { ICompany } from '@repo/shared';

// Define a type for the slice state
export interface CompanyState {
    value: ICompany | null;
}

// Define the initial state using that type
const initialState: CompanyState = {
    value: null,
} as CompanyState;

export const companySlice = createSlice({
    name: 'company',
    initialState,
    reducers: {
        clear: (state) => {
            state.value = null;
        },
        setCompany: (state, action: PayloadAction<ICompany>) => {
            state.value = action.payload;
        },
    },
});

// Action creators are generated for each case reducer function
export const { clear, setCompany: set } = companySlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCompany = (state: RootState) => state.company.value;

export default companySlice.reducer;
