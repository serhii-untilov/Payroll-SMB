import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

// Define a type for the slice state
export interface CompactViewState {
    value: boolean;
}

// Define the initial state using that type
const initialState: CompactViewState = {
    value: false,
};

export const compactViewSlice = createSlice({
    name: 'compactView',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        // Use the PayloadAction type to declare the contents of `action.payload`
        setCompactView: (state, { payload }: PayloadAction<boolean>) => {
            state.value = payload;
        },
    },
});

export const { setCompactView } = compactViewSlice.actions;
// Other code such as selectors can use the imported `RootState` type
export const selectCompactView = (state: RootState) => state.compactView.value;
export default compactViewSlice.reducer;
