import axios from 'axios'
import { updateDB } from '../firebase'
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

// reducer
export default function reducer(state = initialData, action) {
  switch (action.type) {
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