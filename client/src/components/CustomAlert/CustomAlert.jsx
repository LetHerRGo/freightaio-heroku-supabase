import { CloseButton, Alert, Flex } from "@chakra-ui/react";

const CustomAlert = ({ status, alertMessage, onClose }) => {
  return (
    <Alert.Root status={status} alignItems="center">
      <Alert.Indicator />
      <Flex justify="space-between" align="center" w="100%">
        <Alert.Title>{alertMessage}</Alert.Title>
        <CloseButton
          bg="transparent"
          border="none"
          _focus={{ boxShadow: "none", outline: "none", border: "none" }}
          onClick={onClose}
        />
      </Flex>
    </Alert.Root>
  );
};

export default CustomAlert;
