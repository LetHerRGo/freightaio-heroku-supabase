import { CloseButton, Alert } from "@chakra-ui/react";

const CustomAlert = ({ status, alertMessage, onClose }) => {
  return (
    <Alert.Root status={status} alignItems="center">
      <Alert.Indicator />
      <Alert.Title>{alertMessage}</Alert.Title>
      <CloseButton
        position="absolute"
        right="2"
        bg="transparent"
        border="none"
        _focus={{ boxShadow: "none", outline: "none", border: "none" }}
        onClick={onClose}
      />
    </Alert.Root>
  );
};

export default CustomAlert;
