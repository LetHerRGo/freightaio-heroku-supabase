import React from "react";
import { Flex, Text, Icon, Button } from "@chakra-ui/react";

export default function NavItem({ icon, title, active, navSize, onClick }) {
  return (
    <Flex
      mt={4}
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
        p={2}
        _hover={{
          bg: "#AEC8CA",
          boxShadow: "none", // Removes shadow on hover
        }}
        _active={{
          bg: "#AEC8CA",
          boxShadow: "none", // Removes shadow when clicked
        }}
        _focus={{
          boxShadow: "none", // Removes the blue focus outline
          outline: "none", // Additional safeguard
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
