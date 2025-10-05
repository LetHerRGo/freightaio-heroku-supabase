import React from "react";
import { Flex, Text, Icon, Button } from "@chakra-ui/react";

function NavItem({ icon, title, active, navSize, onClick }) {
  return (
    <Flex
      mt={4}
      my={1}
      flexDir="column"
      alignItems={navSize === "small" ? "center" : "flex-start"}
      w="100%"
    >
      <Button
        onClick={onClick}
        w={navSize === "large" ? "100%" : "auto"}
        justifyContent={navSize === "small" ? "center" : "flex-start"}
        bg={active ? "#AEC8CA" : "transparent"}
        borderRadius="8px"
        p={3}
        border="none"
        _hover={{
          bg: "#AEC8CA",
          boxShadow: "none",
          border: "none",
        }}
        _active={{
          bg: "#AEC8CA",
          boxShadow: "none",
          border: "none",
        }}
        _focus={{
          boxShadow: "none",
          outline: "none",
          border: "none",
        }}
      >
        <Icon
          as={icon}
          size="lg"
          color={active ? "#82AAAD" : "#275765"}
          mr={navSize === "small" ? 0 : 2}
        />
        {navSize === "large" && (
          <Text
            color={active ? "#82AAAD" : "#275765"}
            fontSize="xl"
            hideBelow="md"
          >
            {title}
          </Text>
        )}
      </Button>
    </Flex>
  );
}

// ✅ Memoized export
export default React.memo(NavItem);
