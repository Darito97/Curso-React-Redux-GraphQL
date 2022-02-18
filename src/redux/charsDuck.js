import axios from 'axios'
import { updateDB, getFavs } from '../firebase'
import { saveStorage } from './userDuck'
// constantes
let initialData = {
  fetching: false,
  characters: [],
  current: {},
  favorites: []
}
const URL = "https://rickandmortyapi.com/api/character"

let GET_CHARACTERS = "GET_CHARACTERS"
let GET_CHARACTERS_SUCESS = "GET_CHARACTERS_SUCESS"
let GET_CHARACTERS_ERROR = "GET_CHARACTERS_ERROR"

let REMOVE_CHARACTER = "REMOVE_CHARACTER"
let ADD_TO_FAVORITES = "ADD_TO_FAVORITES"

let GET_FAVORITES = "GET_FAVORITES"
let GET_FAVORITES_SUCCESS = "GET_FAVORITES_SUCCESS"
let GET_FAVORITES_ERROR = "GET_FAVORITES_ERROR"

// reducer
export default function reducer(state = initialData, action) {
  switch (action.type) {
    case GET_FAVORITES:
      return { ...state, fetching: true }
    case GET_FAVORITES_ERROR:
      return { ...state, fetching: false, error: action.payload }
    case GET_FAVORITES_SUCCESS:
      return { ...state, fetching: false, favorites: action.payload }
    case ADD_TO_FAVORITES:
      return { ...state, ...action.payload }
    case REMOVE_CHARACTER:
      return { ...state, array: action.payload }
    case GET_CHARACTERS:
      return { ...state, fetching: true }
    case GET_CHARACTERS_ERROR:
      return { ...state, fetch: false, error: action.payload }
    case GET_CHARACTERS_SUCESS:
      return { ...state, array: action.payload, fetching: false }
    default: return state
  }
}
// actions
export const getCharactersAction = () => (dispach, getState) => {
  dispach({
    type: GET_CHARACTERS,
  })
  return axios.get(URL).then(res => {
    dispach({
      type: GET_CHARACTERS_SUCESS,
      payload: res.data.results
    })
  }).catch((error) => {
    dispach({
      type: GET_CHARACTERS_ERROR,
      payload: error.message
    })
  })
}

export const removeCharacterAction = () => (dispach, getState) => {
  let array = getState().characters.array
  array.shift()
  dispach({
    type: REMOVE_CHARACTER,
    payload: [...array]
  })
}

export const addToFavoritesAction = () => (dispach, getState) => {
  let { array, favorites } = getState().characters
  let { uid } = getState().user
  let char = array.shift()
  favorites.push(char)
  updateDB(favorites, uid)
  dispach({
    type: ADD_TO_FAVORITES,
    payload: {
      array: [...array],
      favorites: [...favorites]
    }
  })
}

export const retreiveFavs = () => (dispach, getState) => {
  dispach({
    type: GET_FAVORITES
  })
  let { uid } = getState().user
  return getFavs(uid).then(favs => {
    console.log(favs)
    dispach({
      type: GET_FAVORITES_SUCCESS,
      payload: [...favs]
    })
    saveStorage(getState())
  }
  ).catch(err => {
    console.log(err)
    dispach({
      type: GET_FAVORITES_ERROR,
      payload: err.message
    })
  })

}

export const restoreFavsAction = () => (dispach) => {
  let storage = localStorage.getItem('storage')
  storage = JSON.parse(storage)
  if (storage && storage.characters) {
    dispach({
      type: GET_FAVORITES_SUCCESS,
      payload: storage.characters.favorites
    })
  }
}