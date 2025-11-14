import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { supabase } from "../../lib/supabaseClient";
import CustomAlert from "../CustomAlert/CustomAlert";
import {
  Box,
  Table,
  Flex,
  Heading,
  Highlight,
  Field,
  Textarea,
  Button,
} from "@chakra-ui/react";

function Track() {
  const navigate = useNavigate();
  const [ctnrNums, setCtnrNums] = useState("");
  const [ctnrData, setCtnrData] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [warningMessage, setWarningMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const isLogedIn = localStorage.getItem("access_token");
    if (!isLogedIn) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
    }

    try {
      const response = await axios.post(
        `/track`,
        { ctnrNums: ctnrNums },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const { equipmentList, message } = response.data;
      setCtnrData(equipmentList);

      if (message?.includes("No data available")) {
        setWarningMessage(message);
        setSuccessMessage("");
      } else {
        setSuccessMessage(message || "Tracking data fetched successfully.");
        setWarningMessage("");
      }

      setError("");
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("access_token");
        navigate("/login");
      } else {
        setError(error.response.data.message);
      }
    }
  };

  return (
    <Box overflowX="auto">
      <Flex direction="column" justifyContent="center" gap="5" p="1" m="1">
        <Heading size="6xl" letterSpacing="tight">
          <Highlight query="FREIGHTAIO" styles={{ color: "#79a5b2" }}>
            WELCOME TO THE FREIGHTAIO
          </Highlight>
        </Heading>
        <form className="containerInput-form" onSubmit={handleSubmit}>
          {successMessage && (
            <CustomAlert
              status="success"
              alertMessage={successMessage}
              onClose={() => setSuccessMessage("")}
            />
          )}

          {warningMessage && (
            <CustomAlert
              status="warning"
              alertMessage={warningMessage}
              onClose={() => setWarningMessage("")}
            />
          )}
          {error && (
            <CustomAlert
              status="error"
              alertMessage={error}
              onClose={() => setError("")}
            />
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
