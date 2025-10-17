import React, { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Flex, IconButton, Box, Avatar, Heading } from "@chakra-ui/react";
import { FiMenu } from "react-icons/fi";
import NavItem from "./NavItem.jsx";
import { CiLogout, CiSearch } from "react-icons/ci";
import { MdOutlineDirectionsRailway } from "react-icons/md";
import { CgPlayListAdd } from "react-icons/cg";
import { jwtDecode } from "jwt-decode";

export default function Sidebar({ navSize, onToggleNav }) {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  let username = "";

  if (token) {
    const decoded = jwtDecode(token);
    username = decoded.username;
  }

  const navItems = [
    { icon: MdOutlineDirectionsRailway, title: "Trace", path: "/home/trace" },
    { icon: CiSearch, title: "Track", path: "/home/track" },
    { icon: CgPlayListAdd, title: "Add Shipment", path: "/home/addshipment" },
    { icon: CiLogout, title: "Log Out", action: "logout" },
  ];

  const handleNavigate = useCallback(
    (path) => () => navigate(path),
    [navigate]
  );

  const handleLogout = useCallback(() => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("token");
    navigate("/login");
  }, [navigate]);

  return (
    <Flex
      bg="#79a5b2"
      pos="sticky"
      left="5"
      h="95vh"
      marginTop="2.5vh"
      boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.05)"
      borderRadius={navSize == "small" ? "15px" : "30px"}
      w={navSize == "small" ? "75px" : "210px"}
      flexDir="column"
      justifyContent="space-between"
      transition="all 0.3s ease"
    >
      <Flex
        p="5%"
        flexDir="column"
        w="100%"
        alignItems={navSize == "small" ? "center" : "flex-start"}
        as="nav"
      >
        <IconButton
          aria-label="Toggle sidebar"
          background="none"
          mt={5}
          border="none"
          _hover={{
            background: "#d8ecee",
            boxShadow: "none",
            textDecor: "none",
            border: "none",
          }}
          _focus={{ boxShadow: "none", border: "none" }}
          _active={{ boxShadow: "none", border: "none" }}
          onClick={onToggleNav}
        >
          <FiMenu
            border="none"
            _focus={{ boxShadow: "none", border: "none" }}
            _active={{ boxShadow: "none", border: "none" }}
          />
        </IconButton>
        {navItems.map(({ icon, title, path, action }) => (
          <NavItem
            key={title}
            navSize={navSize}
            icon={icon}
            title={title}
            active={path ? location.pathname === path : false}
            onClick={action === "logout" ? handleLogout : handleNavigate(path)}
          />
        ))}
      </Flex>

      <Flex
        p="5%"
        flexDir="column"
        // w="100%"
        alignItems={navSize == "small" ? "center" : "flex-start"}
        mb={4}
      >
        <Flex mt={4} align="center">
          <Avatar.Root>
            <Avatar.Fallback name={username} />
          </Avatar.Root>
          <Flex
            flexDir="column"
            ml={4}
            display={navSize == "small" ? "none" : "flex"}
          >
            <Heading
              as="h3"
              size="lg"
              color="#275765"
              display={navSize == "small" ? "none" : "flex"}
              hideBelow="md"
            >
              {username}
            </Heading>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
