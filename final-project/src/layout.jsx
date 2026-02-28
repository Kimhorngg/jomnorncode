import React from "react";
import { Outlet } from "react-router";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/navbar/Footer";
import LearnLesson from "./pages/LearnLesson";

export default function Layout() {
  return (
    <>
      <Navbar/>
      <Outlet/>
      <Footer/>
    </>
  );
}
