import { FunctionComponent, Suspense } from 'react'
import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom'
import Home from '../pages/Home'
import Template from '../pages/Templates'
import Settings from '../pages/Settings'
import PDFViewer from '../pages/PDFViewer'

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
        <Route
          path="/pdf"
          element={
            <Suspense fallback={'Loading...'}>
              <PDFViewer />
            </Suspense>
          }
        />
      </Routes>
    </Router>
  )
}

export default Navigation
