import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Flex,
  Heading,
  Highlight,
  Alert,
  CloseButton,
  Field,
  NativeSelect,
  Button,
  Input,
  IconButton,
} from "@chakra-ui/react";
import { IoMdAdd } from "react-icons/io";
import AddAgentName from "../AddAgentName/AddAgentName.jsx";
import AddClientName from "../AddClientName/AddClientName.jsx";

function AddShipment() {
  const [ctnrNum, setCtnrNum] = useState("");
  const [agentName, setAgentName] = useState("");
  const [clientName, setClientName] = useState("");
  const [refNum, setRefNum] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [agents, setAgents] = useState([]);
  const [clients, setClients] = useState([]);
  const [addAgentDialogOpen, setAddAgentDialogOpen] = useState(false);
  const [addClientDialogOpen, setAddClientDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogError, setDialogError] = useState("");

  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const token = localStorage.getItem("token");

  //open dialog for adding agent or client name
  const openAddAgentDialog = (item) => {
    setSelectedItem(item);
    setAddAgentDialogOpen(true);
  };

  const openAddClientDialog = (item) => {
    setSelectedItem(item);
    setAddClientDialogOpen(true);
  };

  //close dialog
  const closeDialog = () => {
    setSelectedItem(null);
    setAddAgentDialogOpen(false);
    setAddClientDialogOpen(false);
  };

  const fetchAgents = async () => {
    try {
      const response = await axios.get(`${apiUrl}agent`);
      setAgents(response.data); // Assuming response is an array of agent names
    } catch (error) {
      console.error("Error fetching agent names:", error);
      setError("Failed to fetch agent names.");
    }
  };

  const fetchClients = async () => {
    try {
      const response = await axios.get(`${apiUrl}client`);
      setClients(response.data);
    } catch (error) {
      console.error("Error fetching client names:", error);
      setError("Failed to fetch client names.");
    }
  };

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/"); // if not login, direct to /
    }

    fetchClients();
    fetchAgents();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validating container number format to ABCD1234567
    const containerFormat = /^[A-Z]{4}\d{7}$/;
    if (!containerFormat.test(ctnrNum)) {
      setError(
        "Invalid container number. Format must be 4 letters followed by 7 digits (e.g., ZCSU4028251)."
      );
      return;
    }

    if (!token) {
      console.error("Token not found in localStorage");
      return;
    }

    try {
      const response = await axios.post(
        `${apiUrl}addshipment`,
        {
          ctnrNum: ctnrNum,
          agentName: agentName,
          clientName: clientName,
          refNum: refNum,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setSuccess(response.data?.message || "Container added successfully.");
      setError("");
      setCtnrNum("");
      setRefNum("");
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("token");
        navigate("/login");
      }

      if (error.response?.data?.message) {
        setError(error.response.data.message); // show backend error message
      } else {
        setError("Something went wrong");
      }
    }
  };

  return (
    <Box ml="50px" p="6" w="auto">
      <Flex direction="column" justify="center" gap="5">
        <Heading size="6xl" letterSpacing="tight" textAlign="center">
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
          {success && (
            <Alert.Root status="success">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>Success!</Alert.Title>
                <Alert.Description>{success}</Alert.Description>
              </Alert.Content>
              <CloseButton
                pos="relative"
                top="-2"
                insetEnd="-2"
                variant="ghost"
                onClick={() => setSuccess("")}
              />
            </Alert.Root>
          )}
          {dialogError && (
            <Alert.Root status="error">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>Error</Alert.Title>
                <Alert.Description>{dialogError}</Alert.Description>
              </Alert.Content>
              <CloseButton onClick={() => setDialogError("")} />
            </Alert.Root>
          )}

          {dialogMessage && (
            <Alert.Root status="success">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>Success</Alert.Title>
                <Alert.Description>{dialogMessage}</Alert.Description>
              </Alert.Content>
              <CloseButton onClick={() => setDialogMessage("")} />
            </Alert.Root>
          )}
          <Field.Root>
            <Field.Label>
              Reference#:
              <Field.RequiredIndicator />
            </Field.Label>
            <Input
              placeholder="Input ref#"
              type="text"
              value={refNum}
              onChange={(e) => setRefNum(e.target.value)}
            />
          </Field.Root>
          <Field.Root>
            <Field.Label>
              Container#:
              <Field.RequiredIndicator />
            </Field.Label>
            <Input
              type="text"
              value={ctnrNum}
              onChange={(e) => setCtnrNum(e.target.value)}
              placeholder="Container#"
            />
          </Field.Root>
          <Field.Root>
            <Field.Label>Agent Name:</Field.Label>
            <Flex align="center" gap={5} w="100%">
              <NativeSelect.Root
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
              >
                <NativeSelect.Field>
                  <option value="">Select an agent</option>
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.name}>
                      {agent.name}
                    </option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
              <IconButton
                variant="surface"
                onClick={() => openAddAgentDialog("agent")}
              >
                <IoMdAdd />
              </IconButton>
            </Flex>
          </Field.Root>
          <Field.Root>
            <Field.Label>Client Name:</Field.Label>
            <Flex align="center" gap={5} w="100%">
              <NativeSelect.Root
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              >
                <NativeSelect.Field>
                  <option value="">Select an client</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.name}>
                      {client.name}
                    </option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
              <IconButton
                variant="surface"
                onClick={() => openAddClientDialog("client")}
              >
                <IoMdAdd />
              </IconButton>
            </Flex>
          </Field.Root>
          <Flex justify="flex-end" mt="4">
            <Button
              type="submit"
              color="#275765"
              backgroundColor="#d8ecee"
              variant="solid"
            >
              Add Shipment
            </Button>
          </Flex>
        </form>
        {addAgentDialogOpen && selectedItem && (
          <AddAgentName
            isOpen={addAgentDialogOpen}
            onClose={closeDialog}
            formName={selectedItem}
            refreshAgents={fetchAgents}
            setDialogMessage={setDialogMessage}
            setDialogError={setDialogError}
          />
        )}
        {addClientDialogOpen && selectedItem && (
          <AddClientName
            isOpen={addClientDialogOpen}
            onClose={closeDialog}
            formName={selectedItem}
            refreshClients={fetchClients}
            setDialogMessage={setDialogMessage}
            setDialogError={setDialogError}
          />
        )}
      </Flex>
    </Box>
  );
}

export default AddShipment;
