import { loginWithGoogle } from '../firebase'
//constanst
let initialData = {
  loggedIn: false,
  fetching: false,
}
let LOGIN = "LOGIN"
let LOGIN_SUCCESS = 'LOGIN_SUCESS'
let LOGIN_ERROR = 'LOGIN_ERROR'
// reducer
export default function reducer(state = initialData, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return { ...state, loggedIn: true, fetching: false, ...action.payload }
    case LOGIN_ERROR:
      return { ...state, error: action.payload, fetching: false }
    case LOGIN:
      return { ...state, fetching: true }
    default: return state
  }
}
//aux
function saveStorage(storage) {
  localStorage.storage = JSON.stringify(storage)
}


// action (action creator)
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
  }).catch(err => {
    dispatch({
      type: LOGIN_ERROR,
      payload: err.message
    })
  })
}