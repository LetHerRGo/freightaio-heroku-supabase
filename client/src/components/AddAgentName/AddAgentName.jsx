import { useState } from "react";
import {
  Dialog,
  Portal,
  Button,
  CloseButton,
  Field,
  Input,
} from "@chakra-ui/react";
import axios from "axios";

function AddAgentName({
  isOpen,
  onClose,
  formName,
  setDialogMessage,
  setDialogError,
  refreshAgents,
}) {
  const [agentName, setAgentName] = useState("");

  const token = localStorage.getItem("token");
  const apiUrl = import.meta.env.VITE_APP_API_URL;

  const handleAddAgent = async () => {
    if (!agentName.trim()) return;

    try {
      await axios.post(
        `${apiUrl}${formName}`,
        { name: agentName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setAgentName("");
      onClose();
      setDialogMessage("Agent added successfully.");
      setDialogError("");
      await refreshAgents?.();
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("token");
        navigate("/login");
      }
      setDialogError(error.response?.data?.message || "Failed to add agent.");
      setDialogMessage("");
      console.error("Request error:", error);
    }
  };

  return (
    <Dialog.Root open={isOpen}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Need to add an agent?</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Field.Root required>
                <Field.Label>
                  Agent
                  <Field.RequiredIndicator />
                </Field.Label>
                <Input
                  placeholder="Four letter abbreviation : ONQG"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                />
              </Field.Root>
            </Dialog.Body>
            <Dialog.Footer>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button color="gray" variant="outline" onClick={handleAddAgent}>
                Add Agent
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" onClick={onClose} />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

export default AddAgentName;
