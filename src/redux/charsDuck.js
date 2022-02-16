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
    case GET_CHARACTERS_ERROR:
    case GET_CHARACTERS_SUCESS:
      return { ...state, array: action.payload }
    default: return state
  }
}
// actions
export const getCharactersAction = () => (dispach, getState) => {

  return axios.get(URL).then(res => {
    dispach({
      type: GET_CHARACTERS_SUCESS,
      payload: res.data.results
    })
  })
}