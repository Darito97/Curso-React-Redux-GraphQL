import { loginWithGoogle, signOutGoogle } from '../firebase'
import { retreiveFavs } from './charsDuck'
//constanst
let initialData = {
  loggedIn: false,
  fetching: false,
}
let LOGIN = "LOGIN"
let LOGIN_SUCCESS = 'LOGIN_SUCESS'
let LOGIN_ERROR = 'LOGIN_ERROR'

let LOG_OUT = "LOG_OUT"

// reducer
export default function reducer(state = initialData, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return { ...state, loggedIn: true, fetching: false, ...action.payload }
    case LOGIN_ERROR:
      return { ...state, error: action.payload, fetching: false }
    case LOGIN:
      return { ...state, fetching: true }
    case LOG_OUT:
      return { ...initialData }
    default: return state
  }
}
//aux
function saveStorage(storage) {
  localStorage.storage = JSON.stringify(storage)
}


// action (action creator)
export const restoreSessionAction = () => dispach => {
  let storage = localStorage.getItem('storage')
  storage = JSON.parse(storage)
  if (storage && storage.user) {
    dispach({
      type: LOGIN_SUCCESS,
      payload: storage.user
    })
  }
}

export const doGoogleLoginAction = () => (dispatch, getState) => {
  dispatch({
    type: LOGIN
  })
  return loginWithGoogle().then(user => {
    dispatch({
      type: LOGIN_SUCCESS,
      payload: {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL
      }
    })
    saveStorage(getState())
    retreiveFavs()(dispatch, getState)
  }).catch(err => {
    dispatch({
      type: LOGIN_ERROR,
      payload: err.message
    })
  })
}

export const logOutAction = () => (dispach, getState) => {
  signOutGoogle()
  dispach({
    type: LOG_OUT
  })
  localStorage.removeItem('storage')
}