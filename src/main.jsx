import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import "./index.css";
import About from "./pages/About";
import Layout from "./layout";
import Course from "./pages/Course";
import { Provider } from "react-redux";
import { store } from "./app/store";
import LearnLesson from "./pages/LearnLesson";
import SignUp from "./pages/SignUp";
import Learn from "./pages/Learn";
import LearnTrack from "./pages/LearnTrack";
import Quiz from "./pages/Quiz";
import CourseDetail from "./pages/CourseDetail";
import LogIn from "./pages/LogIn";
import Document from "./pages/Document";
import LearnBeforeLogin from "./pages/LearnBeforeLogin";
import { Toaster } from "react-hot-toast";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/course",
        element: <Course />,
      },
      {
        path: "/coursedetail/:courseId",
        element: <CourseDetail />,
      },
      {
        path: "/learn",
        element: <Learn />,
      },
      {
        path: "/learntrack",
        element: <LearnTrack />,
      },
      {
        path: "/coursedetail/:courseId/lesson/:lessonId",
        element: <LearnLesson />,
      },
      {
        path: "/coursedetail/:courseId/lesson/:lessonId/quiz",
        element: <Quiz />,
      },
      {
        path: "/document",
        element: <Document />,
      },
      {
        path: "/learnbeforelogin",
        element: <LearnBeforeLogin />,
      },
    ],
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/login",
    element: <LogIn />,
  },
]);

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <Provider store={store}>
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </>
  </Provider>,
);
