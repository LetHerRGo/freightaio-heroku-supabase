import { useState, useEffect } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Field,
  Input,
  VStack,
  Heading,
  Link,
  HStack,
} from "@chakra-ui/react";
import Logo from "../../assets/logo/logo_with_text.svg?react";
import { createClient } from "@supabase/supabase-js";
import CustomAlert from "../../components/CustomAlert/CustomAlert";

function SignupPage() {
  return (
    <Box
      minH="100vh"
      minW="100vw"
      bg="#d8ecee"
      display="flex"
      flexDir="column"
      alignItems="center"
      justifyContent="flex-start"
      px={4}
    >
      <Logo style={{ width: "400px", height: "400px" }} />
      <Box
        bg="white"
        maxW="400px"
        w="100%"
        p={8}
        borderRadius="lg"
        boxShadow="lg"
      >
        <VStack spacing={5} align="stretch">
          <Heading textAlign="center" color="#275765">
            Sign up page is under construction.
          </Heading>
        </VStack>
      </Box>
    </Box>
  );
}

export default SignupPage;
