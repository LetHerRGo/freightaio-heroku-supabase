import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  Field,
  Input,
  VStack,
  Text,
  Heading,
  Link,
  HStack,
} from "@chakra-ui/react";
import Logo from "../../assets/logo/logo_with_text.svg?react";
import CustomAlert from "../../components/CustomAlert/CustomAlert";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Username or password cannot be empty!");
      return;
    }

    try {
      const response = await axios.post("/login", {
        username,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("isAuthenticated", true);
      navigate("/home/trace");
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    }
  };

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
            Login
          </Heading>
          {error && (
            <CustomAlert
              status="error"
              alertMessage={error}
              onClose={() => setError("")}
            />
          )}
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <Field.Root>
                <Field.Label>
                  Username
                  <Field.RequiredIndicator />
                </Field.Label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  borderColor="#79a5b2"
                  css={{ "--focus-color": "#275765" }}
                />
                <Field.ErrorText>{error}</Field.ErrorText>
              </Field.Root>
              <Field.Root>
                <Field.Label>
                  Password
                  <Field.RequiredIndicator />
                </Field.Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  borderColor="#79a5b2"
                  css={{ "--focus-color": "#275765" }}
                />
                <Field.ErrorText>{error}</Field.ErrorText>
              </Field.Root>
              <Button
                type="submit"
                color="white"
                bg="#e1929b"
                _hover={{ bg: "#d87f8c" }}
                width="100%"
              >
                Login
              </Button>
              <HStack justify="space-between" w="100%">
                <Link
                  as={RouterLink}
                  to="/resetpassword"
                  color="#275765"
                  fontSize="sm"
                  _hover={{ color: "#d87f8c", textDecoration: "none" }}
                >
                  Forgot password?
                </Link>
                <Link
                  as={RouterLink}
                  to="/signup"
                  color="#275765"
                  fontSize="sm"
                  _hover={{ color: "#d87f8c", textDecoration: "none" }}
                >
                  Sign up
                </Link>
              </HStack>
            </VStack>
          </form>
        </VStack>
      </Box>
    </Box>
  );
}

export default LoginPage;
