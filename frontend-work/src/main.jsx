import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import MainLayout from "./layout/MainLayout.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Profile from "./pages/Profile.jsx";
import Results from "./pages/Results.jsx";
import Register from "./pages/Register.jsx";
import CreatePost from "./pages/CreatePost.jsx";
import AdDetail from "./pages/AdDetail.jsx";
import MyAds from "./pages/MyAds.jsx";
import MyOffers from "./pages/MyOffers.jsx";
import NegotiationChat from "./pages/NegotiationChat.jsx";
import ContractView from "./pages/ContractView.jsx";
import Messages from "./pages/Messages.jsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "results",
        element: <Results />,
      },
      {
        path: "ad/:id",
        element: <AdDetail />,
      },
      {
        path: "my-ads",
        element: <MyAds />,
      },
      {
        path: "my-offers",
        element: <MyOffers />,
      },
      {
        path: "chat/:adId",
        element: <NegotiationChat />,
      },
      {
        path: "contract/:adId",
        element: <ContractView />,
      },
      {
        path: "messages",
        element: <Messages />,
      },
      {
        path: "messages/:adId",
        element: <NegotiationChat />,
      },
      {
        path: "create",
        element: <CreatePost />,
      },
    ],
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "register",
    element: <Register />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
