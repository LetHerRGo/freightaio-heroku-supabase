import React, { useState } from "react";
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

  const handleLogout = (e) => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("token");
    navigate("/login");
  };

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
          _hover={{
            background: "#d8ecee",
            boxShadow: "none",
            textDecor: "none",
          }}
          _focus={{ boxShadow: "none" }}
          _active={{ boxShadow: "none" }}
          onClick={onToggleNav}
        >
          <FiMenu />
        </IconButton>
        <NavItem
          navSize={navSize}
          icon={MdOutlineDirectionsRailway}
          title="Trace"
          active={location.pathname === "/home/trace"}
          onClick={() => navigate("/home/trace")}
        />
        <NavItem
          navSize={navSize}
          icon={CiSearch}
          title="Track"
          active={location.pathname === "/home/track"}
          onClick={() => navigate("/home/track")}
        />
        <NavItem
          navSize={navSize}
          icon={CgPlayListAdd}
          title="Add Shipment"
          active={location.pathname === "/home/addshipment"}
          onClick={() => navigate("/home/addshipment")}
        />
        <NavItem
          navSize={navSize}
          icon={CiLogout}
          title="Log Out"
          onClick={handleLogout}
        />
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
            <Avatar.Image src="https://bit.ly/broken-link" />
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
