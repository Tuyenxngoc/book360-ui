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
import config from "~/config";

function App() {

  return (
    <div className="App">
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/" element={<DefaultLayout />}>
            {/* public routes */}
            {publicRoutes.map((route, index) => {
              return (<Route key={index} path={route.path} element={route.component} />);
            })}

            {/* private routes */}
            <Route element={<RequireAuth allowedRoles={[config.ROLES.User, config.ROLES.Admin]} />}>
              {privateRoutes.map((route, index) => {
                return (<Route key={index} path={route.path} element={route.component} />);
              })}
            </Route>
            {/* catch all */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
