import ReactDOM from "react-dom/client";
import { createBrowserRouter, Outlet } from "react-router";
import { RouterProvider } from "react-router/dom";
import App from "./App";
import About from "./pages/About";
import Layout from "./layout";

import Course from "./pages/Course";
import Footer from "./components/navbar/Footer";
import LearnLesson from "./pages/LearnLesson";
import SignUp from "./pages/SignUp";
import Learn from "./pages/Learn";
import LearnTrack from "./pages/LearnTrack";
import Quiz from "./pages/Quiz";
import CourseDetail from "./pages/CourseDetail";
import LogIn from "./pages/LogIn";
import Document from "./pages/Document";
import LearnBeforeLogin from "./pages/LearnBeforeLogin";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout/>,
    children: [
      {
        path: "/",
        element: <App/>,
      },
      {
        path: "/about",
        element: <About/>,
      },
      {
        path: "/course",
        element: <Course/>,
      },
      {
        path:"/coursedetail",
        element:<CourseDetail/>,
      },
      {
        path:"/learn",
        element:<Learn/>,
      },
      {
        path:"/learntrack",
        element:<LearnTrack/>,
      },
      {
        path:"/learnlesson",
        element:<LearnLesson/>,
      },
      {
        path:"/quiz",
        element:<Quiz/>,
      },
      {
        path:"/document",
        element:<Document/>,
      },
       {
        path:"/learnbeforelogin",
        element:<LearnBeforeLogin/>,
      },
       
    ],
  },
  {
    path: "/signup",
    element: <SignUp/>,
  },
  {
    path:"/login",
      element:<LogIn/>,
  }

]);

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(<RouterProvider router={router} />);
