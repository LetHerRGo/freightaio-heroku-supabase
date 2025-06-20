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
    <Box w="100vw">
      <Flex>
        <Sidebar navSize={navSize} onToggleNav={toggleNavSize} />
        <Flex justifyContent="stretch" margin="0 auto">
          <Outlet />
        </Flex>
      </Flex>
    </Box>
  );
}
