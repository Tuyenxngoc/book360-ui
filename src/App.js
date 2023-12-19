import { Routes, Route, BrowserRouter } from 'react-router-dom';
//Toast
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//Routes
import { privateRoutes, publicRoutes, adminRoutes } from '~/routes';
//Pages
import DefaultLayout from '~/layouts/DefaultLayout';
import RequireAuth from './utils/RequireAuth';
import { Fragment } from 'react';
import { ROLES } from './config';

function App() {

  return (
    <Fragment>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="light"
      />
      <BrowserRouter>
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

          {/* admin routes */}
          <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
            {adminRoutes.map((route, index) => {
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

        </Routes>
      </BrowserRouter>
    </Fragment>
  );
}

export default App;