import { createTheme, responsiveFontSizes, Theme } from '@mui/material';
import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { ukUA } from '@mui/material/locale';
import { defaultTheme } from '@/themes/defaultTheme';

// Define a type for the slice state
export interface ThemeState {
    value: Theme;
}

// Define the initial state using that type
const initialState: ThemeState = {
    value: responsiveFontSizes(createTheme(defaultTheme('light'), ukUA)),
};

export const themeSlice = createSlice({
    name: 'theme',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        // Use the PayloadAction type to declare the contents of `action.payload`
        setTheme: (state, { payload }) => {
            state.value = payload;
        },
    },
});

export const { setTheme } = themeSlice.actions;
// Other code such as selectors can use the imported `RootState` type
export const selectTheme = (state: RootState) => state.theme.value;
export default themeSlice.reducer;
