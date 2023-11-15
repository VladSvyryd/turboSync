import { FunctionComponent, Suspense } from 'react'
import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom'
import TurboSync from '../pages/Sync'

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
              <TurboSync />
            </Suspense>
          }
        />
      </Routes>
    </Router>
  )
}

export default Navigation
