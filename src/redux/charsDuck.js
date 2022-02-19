import axios from 'axios'
import { updateDB, getFavs } from '../firebase'
import { saveStorage } from './userDuck'
import ApolloClient, { gql } from 'apollo-boost'
// constantes
let initialData = {
  fetching: false,
  characters: [],
  current: {},
  favorites: [],
  nextPage: 1
}
const URL = "https://rickandmortyapi.com/api/character"

const client = new ApolloClient({
  uri: "https://rickandmortyapi.com/graphql"
})

let UPDATE_PAGE = 'UPDATE_PAGE'

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
    case UPDATE_PAGE:
      return { ...state, nextPage: action.payload }
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
  let query = gql`
    query ($page:Int){
      characters(page:$page){
        info{
          pages
          next
          prev
        }
        results{
          name
          image
        }
      }
    }
  `
  dispach({
    type: GET_CHARACTERS,
  })
  let { nextPage } = getState().characters
  return client.query({
    query,
    variables: { page: nextPage }
  }).then(({ data, error }) => {
    if (error) {
      dispach({
        type: GET_CHARACTERS_ERROR,
        payload: error
      })
      return
    }
    dispach({
      type: GET_CHARACTERS_SUCESS,
      payload: data.characters.results
    })
    dispach({
      type: UPDATE_PAGE,
      payload: data.characters.info.next ? data.characters.info.next : 1
    })
  })
  /*return axios.get(URL).then(res => {
    dispach({
      type: GET_CHARACTERS_SUCESS,
      payload: res.data.results
    })
  }).catch((error) => {
    dispach({
      type: GET_CHARACTERS_ERROR,
      payload: error.message
    })
  }) */
}

export const removeCharacterAction = () => (dispach, getState) => {
  let array = getState().characters.array
  array.shift()
  if (array.length === 0) {
    getCharactersAction()(dispach, getState)
    return
  }
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