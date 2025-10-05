import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import { Box, Flex, useBreakpointValue } from "@chakra-ui/react";
import { useState, useEffect } from "react";

export default function HomePage() {
  const [navSize, setNavSize] = useState("large");
  const responsiveSize = useBreakpointValue({
    base: "small",
    md: "large",
  });

  useEffect(() => {
    setNavSize(responsiveSize);
  }, [responsiveSize]);

  const toggleNavSize = () => {
    setNavSize((prev) => (prev === "small" ? "large" : "small"));
  };
  return (
    <Flex h="100vh" w="100vw" overflow="hidden">
      {/* Sidebar Section */}
      <Box
        as="aside"
        w={navSize === "small" ? "80px" : "250px"}
        flexShrink={0} // ✅ prevents sidebar from shrinking
      >
        <Sidebar navSize={navSize} onToggleNav={toggleNavSize} />
      </Box>

      {/* Main Content Section */}
      <Flex p="1" w="100%" flex="1" justifyContent="center">
        <Outlet /> {/* ✅ Trace, Track, AddShipment render here */}
      </Flex>
    </Flex>
  );
}
