import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import Home from './components/home/HomePage'
import GraphHome from './components/home/GraphHome'
import FavPage from './components/favs/FavPage'
import LoginPage from './components/login/LoginPage'

function PrivateRoute({ loggedIn, path, component, ...rest }) {

  if (loggedIn) {
    return <Route path={path} component={component} />

  }
  else {
    return <Redirect to='/login' {...rest} />
  }
}

function Routes({ loggedIn }) {
  return (
    <Switch>
      <PrivateRoute loggedIn={loggedIn} exact path="/" component={Home} />
      <PrivateRoute loggedIn={loggedIn} path="/favs" component={FavPage} />
      <Route path="/login" component={LoginPage} />
    </Switch>
  )
}
function mapStateToProps({ user: { loggedIn } }) {
  return {
    loggedIn
  }

}

export default connect(mapStateToProps)(Routes)