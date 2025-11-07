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
import { supabase } from "../../lib/supabaseClient";
import CustomAlert from "../../components/CustomAlert/CustomAlert";

function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (confirmPassword && password !== confirmPassword) {
      setConfirmError("Passwords do not match!");
    } else {
      setConfirmError("");
    }
  }, [password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password || !confirmPassword) {
      setError("All field are required!");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      setError(error.message);
      return;
    }
    console.log(data);
    if (data?.session) {
      navigate("/login", {
        state: { success: "Signup successful!" },
      });
    } else {
      setSuccess(
        "Signup successful! Please check your email to confirm your account"
      );
      setEmail("");
      setPassword("");
      setConfirmPassword("");
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
            Sign up
          </Heading>
          {error && (
            <CustomAlert
              status="error"
              alertMessage={error}
              onClose={() => setError("")}
            />
          )}
          {success && (
            <CustomAlert
              status="success"
              alertMessage={success}
              onClose={() => setSuccess("")}
            />
          )}

          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <Field.Root required>
                <Field.Label>
                  Email
                  <Field.RequiredIndicator />
                </Field.Label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  borderColor="#79a5b2"
                  css={{ "--focus-color": "#275765" }}
                  autoFocus
                />
              </Field.Root>
              <Field.Root invalid={!!confirmError} required>
                <Field.Label>
                  Password
                  <Field.RequiredIndicator />
                </Field.Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  borderColor={confirmError ? "red.400" : "#79a5b2"}
                  css={{ "--focus-color": "#275765" }}
                />
              </Field.Root>
              <Field.Root invalid={!!confirmError} required>
                <Field.Label>
                  Confirm password
                  <Field.RequiredIndicator />
                </Field.Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  borderColor={confirmError ? "red.400" : "#79a5b2"}
                  css={{ "--focus-color": "#275765" }}
                />
                <Field.ErrorText>{confirmError}</Field.ErrorText>
              </Field.Root>
              <Button
                type="submit"
                color="white"
                bg="#e1929b"
                _hover={{ bg: "#d87f8c", borderColor: "transparent" }}
                width="100%"
              >
                Sign up
              </Button>
              <HStack justify="space-between" w="100%">
                <Link
                  as={RouterLink}
                  to="/forgot-password"
                  color="#275765"
                  fontSize="sm"
                  _hover={{ color: "#d87f8c", textDecoration: "none" }}
                >
                  Forgot password?
                </Link>
                <Link
                  as={RouterLink}
                  to="/login"
                  color="#275765"
                  fontSize="sm"
                  _hover={{ color: "#d87f8c", textDecoration: "none" }}
                >
                  Login
                </Link>
              </HStack>
            </VStack>
          </form>
        </VStack>
      </Box>
    </Box>
  );
}

export default SignupPage;
