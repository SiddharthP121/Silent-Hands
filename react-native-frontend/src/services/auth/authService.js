import {
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute,
} from 'amazon-cognito-identity-js';
import { CognitoUserPool } from 'amazon-cognito-identity-js';

export const signup = (email, password) => {
  return new Promise((resolve, reject) => {
    const attributes = [
      new CognitoUserAttribute({ Name: 'email', Value: email }),
    ];
    CognitoUserPool.signup(email, password, signup, null, (err, result) => {
      if (err) return reject("Promise rejected at authService.js :: signup", err);
      resolve(result.user);
    });
  });
};

export const confirmSignup = (email, code) => {
    return new Promise((resolve, reject) => {
      const user = new CognitoUser({Username: email, Pool: CognitoUserPool})
      user.confirmRegistration(code, true, (err, result) => {
        if(err) return reject("Promise rejected at authService.js :: confirmSignup", err)
        resolve(result)
      }
      )
    })
    
};

export const login = (email, password) => {
    return new Promise((resolve, reject) => {
      const user = new CognitoUser({Username: email, Pool: CognitoUserPool})
      const authDetails = new AuthenticationDetails({
        Username: email,
        Password: password,
      })
      user.authenticateUser(authDetails, {
        onFailure: (err)=> reject("Promise rejected at authService.js :: login", err),
        onSuccess: (result)=> resolve(result)
      })
    })
    
};

export const logout = () => {
    const user = CognitoUserPool.getCurrentUser()
    if (user) user.signOut()
};

export const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
      const user = CognitoUserPool.getCurrentUser()
      if(!user) reject("No user logged in")
      user.getSession((err, session) => {
        if(err) return reject("Promise rejected at authService.js :: getCurrentUser", err)
        resolve(session)
      }
      )
    })
    
};
