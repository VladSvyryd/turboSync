import { FunctionComponent, Suspense } from 'react'
import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom'
import Home from '../pages/Home'
import Template from '../pages/Template'
import Settings from '../pages/Settings'

interface OwnProps {}

type Props = OwnProps

const Navigation: FunctionComponent<Props> = () => {
  const Router = process.env.NODE_ENV === 'development' ? BrowserRouter : HashRouter
  return (
    <Router basename={'/'}>
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={'Loading...'}>
              <Home />
            </Suspense>
          }
        />
        <Route
          path="/templates"
          element={
            <Suspense fallback={'Loading...'}>
              <Template />
            </Suspense>
          }
        />
        <Route
          path="/settings"
          element={
            <Suspense fallback={'Loading...'}>
              <Settings />
            </Suspense>
          }
        />
      </Routes>
    </Router>
  )
}

export default Navigation
