import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import MainLayout from "./layout/MainLayout.jsx";
import Home from "./pages/Home.jsx"
import Login from "./pages/Login.jsx";
import Profile from "./pages/Profile.jsx";
import Results from "./pages/Results.jsx";
import Register from "./pages/Register.jsx";
import CreatePost from "./pages/CreatePost.jsx";
import AdDetail from "./pages/AdDetail.jsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "profile",
        element: <Profile></Profile>
      },
      {
        path: "results",
        element: <Results></Results>
      },
      {
        path: "ad/:id",
        element: <AdDetail></AdDetail>
      }
    ],
  },
  {
    path: "login",
    element: <Login></Login>
  },
  {
    path: "register",
    element: <Register></Register>
  },
  {
    path: "create",
    element: <CreatePost></CreatePost>
  }
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
