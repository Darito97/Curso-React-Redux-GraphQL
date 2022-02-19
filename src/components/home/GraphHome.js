import React, { useEffect, useState } from 'react'
import Card from '../card/Card'
import { gql } from 'apollo-boost'
import { useQuery } from 'react-apollo'

export default function GraphHome() {
  const [chars, setChars] = useState([])
  let query = gql`
    {
      characters{
        results{
          name
          image
        }
      }
    }
  `
  let { data, loading, error } = useQuery(query)

  useEffect(() => {
    if (data && !loading && !error) {
      setChars(data.characters.results)
    }

  }, [data, loading, error])

  function nextCharacter() {
    let newChars = [...chars]
    newChars.shift()
    setChars([...newChars])
  }

  if (loading) { return <h2>Cargando...</h2> }


  return (
    <Card
      //rightClick={addFav} 
      leftClick={nextCharacter}
      {...chars[0]}
    />

  )
}