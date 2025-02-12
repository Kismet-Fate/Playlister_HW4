import React, { createContext, useEffect, useState, useContext } from "react";
import { useHistory } from 'react-router-dom';
import MUIAccountCreationErrorModal from "../components/MUIAccountCreationErrorModal";
import { GlobalStoreContext } from '../store';
import api from './auth-request-api';



const AuthContext = createContext();
console.log("create AuthContext: " + AuthContext);
// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    LOGIN_USER: "LOGIN_USER",
    LOGOUT_USER: "LOGOUT_USER",
    REGISTER_USER: "REGISTER_USER",
    AUTH_ERROR: "AUTH_ERROR"
}

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false,
        err: ""
    });
    const history = useHistory();

    useEffect(() => {
        auth.getLoggedIn();
    }, []);

    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn
                });
            }
            case AuthActionType.LOGIN_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true
                })
            }
            case AuthActionType.LOGOUT_USER: {
                return setAuth({
                    user: null,
                    loggedIn: false
                })
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true
                })
            }
            case AuthActionType.AUTH_ERROR: {
                return setAuth({
                    err: payload,
                });
            }
            default:
                return auth;
        }
    }

    auth.getLoggedIn = async function () {
        const response = await api.getLoggedIn();
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.SET_LOGGED_IN,
                payload: {
                    loggedIn: response.data.loggedIn,
                    user: response.data.user
                }
            });
        }
    }
    /* forget it I'm not gonna be able to make store work
    const Thing = (response) => {
        const { store } = useContext(GlobalStoreContext);
        store.showAccountCreationErrorModal(response);
        console.log(response);
        return (
            <MUIAccountCreationErrorModal />);
    }
    */
    auth.showErr = (err) => {
        authReducer({
            type: AuthActionType.AUTH_ERROR,
            payload: err,
        });
    }
    auth.registerUser = async function (firstName, lastName, email, password, passwordVerify) {
        try {
            const response = await api.registerUser(firstName, lastName, email, password, passwordVerify);

            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.REGISTER_USER,
                    payload: {
                        user: response.data.user
                    }
                })
                history.push("/login");
                auth.loginUser(email, password);
            }
            /*
            honestly, I don't even know why this doesnt work but whatever
            
            
            else if (response.status === 400) {
                //Thing(response);
                console.log("meh");
            }
            */
        }
        catch (err) {
            
            auth.showErr(err.response.data.errorMessage);
        }
    }

    auth.loginUser = async function (email, password) {
        try {
            const response = await api.loginUser(email, password);
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.LOGIN_USER,
                    payload: {
                        user: response.data.user
                    }
                })
                history.push("/");
            }
        }
        catch (err) {
            auth.showErr(err.response.data.errorMessage);
        }
    }

    auth.logoutUser = async function () {
        const response = await api.logoutUser();
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.LOGOUT_USER,
                payload: null
            })
            history.push("/");
        }
    }

    auth.getUserInitials = function () {
        let initials = "";
        if (auth.user) {
            initials += auth.user.firstName.charAt(0);
            initials += auth.user.lastName.charAt(0);
        }
        console.log("user initials: " + initials);
        return initials;
    }

    return (
        <AuthContext.Provider value={{
            auth
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };