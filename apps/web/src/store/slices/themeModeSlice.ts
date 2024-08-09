import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

export type ThemeMode = 'light' | 'dark';

// Define a type for the slice state
export interface ThemeModeState {
    value: ThemeMode;
}

// Define the initial state using that type
const initialState: ThemeModeState = {
    value: 'light',
};

export const themeModeSlice = createSlice({
    name: 'themeMode',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        // Use the PayloadAction type to declare the contents of `action.payload`
        setThemeMode: (state, action: PayloadAction<string | null>) => {
            state.value = action.payload === 'dark' ? 'dark' : 'light';
        },
        switchThemeMode: (state) => {
            state.value = state.value === 'light' ? 'dark' : 'light';
        },
    },
});

export const { setThemeMode, switchThemeMode } = themeModeSlice.actions;
// Other code such as selectors can use the imported `RootState` type
export const selectThemeMode = (state: RootState) => state.themeMode.value;
export default themeModeSlice.reducer;
