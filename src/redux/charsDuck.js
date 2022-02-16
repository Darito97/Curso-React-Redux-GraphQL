import axios from 'axios'
// constantes
let initialData = {
  fetching: false,
  characters: [],
  current: {}
}
const URL = "https://rickandmortyapi.com/api/character"

let GET_CHARACTERS = "GET_CHARACTERS"
let GET_CHARACTERS_SUCESS = "GET_CHARACTERS_SUCESS"
let GET_CHARACTERS_ERROR = "GET_CHARACTERS_ERROR"
// reducer
export default function reducer(state = initialData, action) {
  switch (action.type) {
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
    console.log(error)
    dispach({
      type: GET_CHARACTERS_ERROR,
      payload: error.response.message
    })
  })
}