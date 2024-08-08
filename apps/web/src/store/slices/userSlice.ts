import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { User } from '@repo/openapi';

// Define a type for the slice state
export interface UserState {
    value: User | undefined;
}

// Define the initial state using that type
const initialState: UserState = {
    value: undefined,
};

export const userSlice = createSlice({
    name: 'user',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        // Use the PayloadAction type to declare the contents of `action.payload`
        setUser: (state, action: PayloadAction<User>) => {
            state.value = action.payload;
        },
        clearUser: (state) => {
            state.value = undefined;
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;
// Other code such as selectors can use the imported `RootState` type
export const selectUser = (state: RootState) => state.user.value;
export default userSlice.reducer;
