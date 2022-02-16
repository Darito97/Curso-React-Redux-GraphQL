import React from 'react'
import Card from '../card/Card'
import styles from './home.module.css'
import { connect } from 'react-redux'

function Home({ chars }) {
  function renderCharacter() {
    if (chars !== undefined) {
      let char = chars[0]
      return (
        <Card {...char} />
      )
    }
    else {
      return ''
    }
  }


  return (
    <div className={styles.container}>
      <h2>Personajes de Rick y Morty</h2>
      <div>
        {renderCharacter()}
      </div>
    </div>
  )
}

function mapStateToProps(state) {
  console.log(state)
  return {
    chars: state.characters.array
  }
}

export default connect(mapStateToProps)(Home)