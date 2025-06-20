import { useEffect, useState } from "react";
import {
  Dialog,
  Portal,
  Button,
  Spinner,
  Text,
  Box,
  CloseButton,
} from "@chakra-ui/react";
import axios from "axios";

function MovementLogDialog({ isOpen, onClose, containerId, containerNumber }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const apiUrl = import.meta.env.VITE_APP_API_URL;

  useEffect(() => {
    const fetchLogs = async () => {
      if (!isOpen || !containerId) return;
      setLoading(true);
      try {
        const response = await axios.get(`${apiUrl}logs/${containerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLogs(response.data);
      } catch (error) {
        console.error("Failed to fetch logs:", error);
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [isOpen, containerId]);

  return (
    <Dialog.Root open={isOpen}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content maxW="lg" bg="white" p={4} rounded="md">
            <Dialog.Header>
              <Text fontSize="lg" fontWeight="bold">
                Logs for {containerNumber}
              </Text>
              <Dialog.CloseTrigger asChild>
                <CloseButton onClick={onClose} />
              </Dialog.CloseTrigger>
            </Dialog.Header>
            <Dialog.Body>
              {loading ? (
                <Spinner />
              ) : logs.length > 0 ? (
                <Box maxH="300px" overflowY="auto">
                  {logs.map((log) => (
                    <Box
                      key={log.id}
                      p="2"
                      borderBottom="1px solid #ddd"
                      fontSize="sm"
                      fontFamily="monospace"
                    >
                      <Text>
                        <strong>ETA:</strong>{" "}
                        {log.ETA ? new Date(log.ETA).toLocaleString() : "N/A"}
                      </Text>
                      <Text>
                        <strong>Event:</strong> {log.event_description}
                      </Text>
                      <Text>
                        <strong>Event Time:</strong>{" "}
                        {log.event_time
                          ? new Date(log.event_time).toLocaleString()
                          : "N/A"}
                      </Text>
                      <Text>
                        <strong>Location:</strong> {log.location}
                      </Text>
                      <Text>
                        <strong>Destination:</strong> {log.destination}
                      </Text>
                      <Text>
                        <strong>Updated:</strong>{" "}
                        {new Date(log.updated_at).toLocaleString()}
                      </Text>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Text>No logs found for this container.</Text>
              )}
            </Dialog.Body>
            <Dialog.Footer justifyContent="flex-end">
              <Button onClick={onClose} variant="outline">
                Close
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

export default MovementLogDialog;
