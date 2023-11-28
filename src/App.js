import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//Toast
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//Routes
import { privateRoutes, publicRoutes } from "~/routes";
//Pages
import DefaultLayout from "~/layouts/DefaultLayout";
import NotFound from "~/pages/NotFound";
import RequireAuth from "./utils/RequireAuth";
import { Fragment } from "react";

function App() {

  return (
    <div className="App">
      <ToastContainer />
      <Router>
        <Routes>
          {/* public routes */}
          {publicRoutes.map((route, index) => {
            const Page = route.component;
            let Layout = DefaultLayout;
            if (route.layout) {
              Layout = route.layout;
            } else if (route.layout === null) {
              Layout = Fragment;
            }
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          })}

          {/* private routes */}
          <Route element={<RequireAuth />}>
            {privateRoutes.map((route, index) => {
              const Page = route.component;
              let Layout = DefaultLayout;
              if (route.layout) {
                Layout = route.layout;
              } else if (route.layout === null) {
                Layout = Fragment;
              }
              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <Layout>
                      <Page />
                    </Layout>
                  }
                />
              );
            })
            }
          </Route>

          {/* catch all */}
          <Route path="*" element={<DefaultLayout><NotFound /></DefaultLayout>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
