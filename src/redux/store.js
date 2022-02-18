import { createStore, combineReducers, compose, applyMiddleware } from 'redux'
import userReducer from './userDuck'
import thunk from 'redux-thunk'
import charsReducer, { getCharactersAction, restoreFavsAction } from './charsDuck'
import { restoreSessionAction } from './userDuck'

let rootReducer = combineReducers({
  user: userReducer,
  characters: charsReducer
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function generateStore() {
  let store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)))
  //Obteniendo los personajes por primera vez al ejecutar la funcion que devuelve getCharactersAction
  getCharactersAction()(store.dispatch, store.getState)
  restoreSessionAction()(store.dispatch)
  restoreFavsAction()(store.dispatch)
  return store
}