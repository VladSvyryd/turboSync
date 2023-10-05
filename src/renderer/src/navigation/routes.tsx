import {FunctionComponent, Suspense} from 'react';
import {BrowserRouter, HashRouter, Route, Routes} from 'react-router-dom'
import Home from "../pages/Home";
import Template from "../pages/Template";

interface OwnProps {}

type Props = OwnProps;

const Navigation: FunctionComponent<Props> = () => {

const Router =   process.env.NODE_ENV === "development" ? BrowserRouter : HashRouter
  return (
    <Router>
      <Routes>
          <Route
            path="/"
            element={
              <Suspense fallback={"Loading..."}>
                <Home/>
              </Suspense>
            }
          />
        <Route
            path="/templates"
            element={
              <Suspense fallback={"Loading..."}>
                <Template/>
              </Suspense>
            }
          />
      </Routes>
    </Router>

  );
};

export default Navigation;
