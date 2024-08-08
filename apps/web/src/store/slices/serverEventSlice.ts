import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

// Define a type for the slice state
export interface ServerEventState {
    value: string;
}

// Define the initial state using that type
const initialState: ServerEventState = {
    value: '',
};

export const serverEventSlice = createSlice({
    name: 'serverEvent',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        // Use the PayloadAction type to declare the contents of `action.payload`
        setServerEvent: (state, action: PayloadAction<string>) => {
            state.value = action.payload;
        },
    },
});

export const { setServerEvent } = serverEventSlice.actions;
// Other code such as selectors can use the imported `RootState` type
export const selectServerEvent = (state: RootState) => state.serverEvent.value;
export default serverEventSlice.reducer;
