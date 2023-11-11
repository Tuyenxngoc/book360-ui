import { Fragment } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { publicRoutes } from "~/routes";
import DefaultLayout from "~/layouts/DefaultLayout";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {publicRoutes.map((router, index) => {
            const Page = router.component;
            let Layout = DefaultLayout;
            if (router.layout) {
              Layout = router.layout;
            } else if (router.layout === null) {
              Layout = Fragment;
            }

            return <Route
              key={index}
              path={router.path}
              element={
                <Layout>
                  <Page />
                </Layout>
              }
            ></Route>
          })}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
