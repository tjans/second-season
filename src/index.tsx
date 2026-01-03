import React from "react";
import "@/index.css";
import reportWebVitals from "@/reportWebVitals";
import * as ReactDOM from "react-dom/client";
import Layout from "@/pages/Layout";

// Pages
//import Login from "./pages/Login";
import Logout from "@/pages/Logout";
import Home from "@/pages/Home";
import Members from "@/pages/Members";
import Profile from "@/pages/Profile";
import ControlPanel from "@/pages/ControlPanel";
import Unauthorized from "@/pages/Unauthorized";
import PageNotFound from "@/pages/PageNotFound";

// import ButtonDemo from "@/pages/Styles/Buttons";
// import Links from "@/pages/Styles/Links";
// import TextInputStyles from "@/pages/Styles/TextInputs";
// import SelectInputStyles from "@/pages/Styles/SelectInputs";
// import ColorTest from "@/pages/ColorTest";
// import FormStyles from "./pages/Styles/Forms";

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

// Plumbing
import ErrorPage from "@/error-page";
import "react-toastify/dist/ReactToastify.css";
import RequireAuth from "@/components/RequireAuth";

import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import ExpressGame from "./pages/Express/ExpressGame";
import ExpressKickoff from "./pages/Express/ExpressKickoff";
import ExpressPass from "./pages/Express/ExpressPass";
import ExpressRun from "./pages/Express/ExpressRun";
import ExpressFieldGoal from "./pages/Express/ExpressFieldGoal";
import ExpressPunt from "./pages/Express/ExpressPunt";
import ExpressPat from "./pages/Express/ExpressPat";
import ExpressStats from "./pages/Express/ExpressStats";

import TeamsHome from "./pages/Teams/TeamHome";
import TeamEdit from "./pages/Teams/TeamEdit";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>

      <Route path="/" element={<Layout />} errorElement={<ErrorPage />}>
        <Route index element={<Home />} />

        <Route path="/express/game/:gameId" element={<ExpressGame />} />
        <Route path="/express/game/:gameId/kickoff" element={<ExpressKickoff />} />
        <Route path="/express/game/:gameId/pass" element={<ExpressPass />} />
        <Route path="/express/game/:gameId/run" element={<ExpressRun />} />
        <Route path="/express/game/:gameId/fg" element={<ExpressFieldGoal />} />
        <Route path="/express/game/:gameId/punt" element={<ExpressPunt />} />
        <Route path="/express/game/:gameId/pat" element={<ExpressPat />} />
        <Route path="/express/game/:gameId/stats" element={<ExpressStats />} />

        <Route path="/teams" element={<TeamsHome />} />
        <Route path="/teams/:teamId" element={<TeamEdit />} />

        <Route path="/members" element={<Members />} />

        {/* <Route path="/login" element={<Login />} /> */}
        <Route path="/logout" element={<Logout />} />

        {/* <Route path="/styles/buttons" element={<ButtonDemo />} />
        <Route path="/styles/links" element={<Links />} />
        <Route path="/styles/textinputs" element={<TextInputStyles />} />
        <Route path="/styles/selectinputs" element={<SelectInputStyles />} />
        <Route path="/styles/colors" element={<ColorTest />} />
        <Route path="/styles/forms" element={<FormStyles />} /> */}

        <Route element={<RequireAuth />}>
          <Route path="/profile" element={<Profile />} />
        </Route>



        <Route element={<RequireAuth allowedRoles={['Admin']} />}>
          <Route path="/control-panel" element={<ControlPanel />} />
        </Route>

        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </>,
  ),
);
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>

      <RouterProvider router={router} />

    </QueryClientProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
