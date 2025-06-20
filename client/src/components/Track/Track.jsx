import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Box,
  Table,
  Flex,
  Heading,
  Highlight,
  Alert,
  CloseButton,
  Field,
  Textarea,
  Button,
} from "@chakra-ui/react";

function Track() {
  const navigate = useNavigate();
  const [ctnrNums, setCtnrNums] = useState("");
  const [ctnrData, setCtnrData] = useState([]);
  const [error, setError] = useState("");

  const apiUrl = import.meta.env.VITE_APP_API_URL;

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token not found in localStorage");
    }

    try {
      const response = await axios.post(
        `${apiUrl}track`,
        { ctnrNums: ctnrNums },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setCtnrData(response.data.equipmentList);
      setError("");
      setCtnrNums("");
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setError(error.response.data.message);
      }
    }
  };

  return (
    <Box ml="50px" p="6" w="auto">
      <Flex direction="column" justify="center" gap="5">
        <Heading size="6xl" letterSpacing="tight">
          <Highlight query="FREIGHTAIO" styles={{ color: "#79a5b2" }}>
            WELCOME TO THE FREIGHTAIO
          </Highlight>
        </Heading>
        <form className="containerInput-form" onSubmit={handleSubmit}>
          {error && (
            <Alert.Root status="error">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>Error!</Alert.Title>
                <Alert.Description>{error}</Alert.Description>
              </Alert.Content>
              <CloseButton
                pos="relative"
                top="-2"
                insetEnd="-2"
                variant="ghost"
                onClick={() => setError("")}
              />
            </Alert.Root>
          )}
          <Field.Root required>
            <Field.Label>
              Container number
              <Field.RequiredIndicator />:
            </Field.Label>

            <Textarea
              rows="5"
              placeholder="Enter one or more container numbers (e.g. CNRU123456,CNRU234567)"
              variant="outline"
              value={ctnrNums}
              onChange={(e) => setCtnrNums(e.target.value)}
            />
          </Field.Root>
          <Flex justify="flex-end" mt="4">
            <Button
              type="submit"
              color="#275765"
              backgroundColor="#d8ecee"
              variant="solid"
            >
              Submit
            </Button>
          </Flex>
        </form>
        <Box overflowX="auto">
          <Table.Root size="sm" striped>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Equipment ID</Table.ColumnHeader>
                <Table.ColumnHeader>Status</Table.ColumnHeader>
                <Table.ColumnHeader>Last Event</Table.ColumnHeader>
                <Table.ColumnHeader>Last Event Time</Table.ColumnHeader>
                <Table.ColumnHeader>Location</Table.ColumnHeader>
                <Table.ColumnHeader>Customs Status</Table.ColumnHeader>
                <Table.ColumnHeader>Destination</Table.ColumnHeader>
                <Table.ColumnHeader>ETA</Table.ColumnHeader>
                <Table.ColumnHeader>Last Free Day</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {ctnrData.map((item, index) => (
                <Table.Row key={index}>
                  <Table.Cell>{item.id}</Table.Cell>
                  <Table.Cell>{item.status}</Table.Cell>
                  <Table.Cell>{item.eventDescription}</Table.Cell>
                  <Table.Cell>{item.eventTime}</Table.Cell>
                  <Table.Cell>{item.location}</Table.Cell>
                  <Table.Cell>{item.customsStatus}</Table.Cell>
                  <Table.Cell>{item.destination}</Table.Cell>
                  <Table.Cell>{item.ETA}</Table.Cell>
                  <Table.Cell>{item.storageLastFreeDay}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      </Flex>
    </Box>
  );
}

export default Track;
