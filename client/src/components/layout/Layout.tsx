import React from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import LayoutHeader from "./LayoutHeader";

const Layout = () => {
  return (
    <div className="h-screen w-screen grid grid-cols-8 grid-rows-9">
      <header className="col-span-full shadow-[inset_-12px_-8px_40px_#46464620] row-span-1">
        <Header />
      </header>
      <main className="row-span-full col-span-8  row-start-2 flex">
        <aside className="w-[15%] shadow-2xl">
          <Navbar />
        </aside>
        <section className="w-[85%] bg-secondary overflow-x-hidden overflow-y-scroll">
          <LayoutHeader />
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default Layout;
