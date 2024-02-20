import { IAuth, ICreateUser, IUser } from '@repo/shared';
import PropTypes from 'prop-types';
import type { FC, ReactNode } from 'react';
import { createContext, useEffect, useReducer } from 'react';
import { getCurrentUser, loginUser, logoutUser, registerUser } from '../services/auth.service';
import { getUserAccessToken } from '../services/token.service';

interface State {
    isInitialized: boolean;
    isAuthenticated: boolean;
    user: IUser | null;
}

interface AuthContextValue extends State {
    login: (params: IAuth) => Promise<void>;
    logout: () => Promise<void>;
    register: (params: ICreateUser) => Promise<void>;
}

interface AuthProviderProps {
    children: ReactNode;
}

type InitializeAction = {
    type: 'INITIALIZE';
    payload: {
        isAuthenticated: boolean;
        user: IUser | null;
    };
};

type LoginAction = {
    type: 'LOGIN';
    payload: {
        user: IUser;
    };
};

type LogoutAction = {
    type: 'LOGOUT';
};

type RegisterAction = {
    type: 'REGISTER';
    payload: {
        user: IUser;
    };
};

type Action = InitializeAction | LoginAction | LogoutAction | RegisterAction;

const initialState: State = {
    isAuthenticated: false,
    isInitialized: false,
    user: null,
};

const handlers: Record<string, (state: State, action: Action) => State> = {
    INITIALIZE: (state: State, action: InitializeAction | any): State => {
        const { isAuthenticated, user } = action.payload;

        return {
            ...state,
            isAuthenticated,
            isInitialized: true,
            user,
        };
    },
    LOGIN: (state: State, action: LoginAction | any): State => {
        const { user } = action.payload;

        return {
            ...state,
            isAuthenticated: true,
            user,
        };
    },
    LOGOUT: (state: State): State => ({
        ...state,
        isAuthenticated: false,
        user: null,
    }),
    REGISTER: (state: State, action: RegisterAction | any): State => {
        const { user } = action.payload;

        return {
            ...state,
            isAuthenticated: true,
            user,
        };
    },
};

const reducer = (state: State, action: Action): State =>
    handlers[action.type] ? handlers[action.type](state, action) : state;

const AuthContext = createContext<AuthContextValue>({
    ...initialState,
    login: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    register: () => Promise.resolve(),
});

export const AuthProvider: FC<AuthProviderProps> = (props) => {
    const { children } = props;
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        const initialize = async (): Promise<void> => {
            try {
                const accessToken = getUserAccessToken();
                const user = accessToken ? await getCurrentUser() : null;
                if (user) {
                    dispatch({
                        type: 'INITIALIZE',
                        payload: {
                            isAuthenticated: true,
                            user,
                        },
                    });
                } else {
                    dispatch({
                        type: 'INITIALIZE',
                        payload: {
                            isAuthenticated: false,
                            user: null,
                        },
                    });
                }
            } catch (err) {
                console.error(err);
                dispatch({
                    type: 'INITIALIZE',
                    payload: {
                        isAuthenticated: false,
                        user: null,
                    },
                });
            }
        };

        initialize();
    }, []);

    const login = async (params: IAuth): Promise<void> => {
        await loginUser(params);
        const user = await getCurrentUser();
        if (user) {
            dispatch({
                type: 'LOGIN',
                payload: {
                    user,
                },
            });
        }
    };

    const logout = async (): Promise<void> => {
        await logoutUser();
        dispatch({ type: 'LOGOUT' });
    };

    const register = async (params: ICreateUser): Promise<void> => {
        await registerUser(params);
        const user = await getCurrentUser();
        if (user) {
            dispatch({
                type: 'REGISTER',
                payload: {
                    user,
                },
            });
        }
    };

    return (
        <AuthContext.Provider
            value={{
                ...state,
                login,
                logout,
                register,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AuthContext;
