import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

interface Link {
  path: string;
  label: string;
}

const Navbar = () => {
  const [links, setLinks] = useState<Array<Link> | []>([]);
  const role = localStorage.getItem("role");

  const getRoutes = (role: any) => {
    if (role === "user") {
      return [
        { path: "/home", label: "Home" },
        { path: "/profile", label: "Profile" },
      ];
    }
    if (role === "admin") {
      return [
        { path: "/home", label: "Home" },
        { path: "/projects", label: "Project" },
        { path: "/profile", label: "Profile" },
      ];
    }
    if (role === "superAdmin") {
      return [
        { path: "/home", label: "Home" },
        { path: "/projects", label: "Project" },
        { path: "/users", label: "User" },
        { path: "/profile", label: "Profile" },
      ];
    }
    return [];
  };

  useEffect(() => {
    setLinks(getRoutes(role));
  }, [role]);

  return (
    <nav className="bg-primary h-full w-full">
      <ul className="w-full py-8">
        {links.map((link: Link, index) => (
          <li
            key={index}
            className="w-[100%]  flex items-center justify-evenly"
          >
            <NavLink
              to={link.path}
              className={({ isActive }) =>
                isActive
                  ? "text-center bg-lightBlack px-4 w-full py-2 bg-white  text-primary"
                  : "text-center text-white py-2"
              }
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
