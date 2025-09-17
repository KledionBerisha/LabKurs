import React, { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import AccessibleNavigationAnnouncer from './components/AccessibleNavigationAnnouncer'

const Layout = lazy(() => import('./containers/Layout'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/register')) 

function App() {
  return (
    <>
      <Router>
        <AccessibleNavigationAnnouncer />
        <Suspense fallback={<div style={{ padding: 20 }}>Loading…</div>}>
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            
            <Route path="/app" component={Layout} />
            <Redirect exact from="/" to="/login" />
          </Switch>
        </Suspense>
      </Router>
    </>
  )
}

export default App
