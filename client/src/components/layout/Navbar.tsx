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
            className="w-[100%]  flex items-center"
          >
            <NavLink
              to={link.path}
              className={({ isActive }) =>
                isActive
                  ? "  px-8 w-full py-2 bg-secondary  text-primary"
                  : " text-white py-2 px-8 w-full"
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
