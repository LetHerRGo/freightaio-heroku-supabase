import { Dialog, Portal, Button, CloseButton } from "@chakra-ui/react";

function DeleteContainerDialog({
  isOpen,
  onClose,
  onConfirm,
  containerNumber,
}) {
  return (
    <Dialog.Root open={isOpen}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Delete {containerNumber}?</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <p>Are you sure you want to delete {containerNumber}?</p>
            </Dialog.Body>
            <Dialog.Footer>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={onConfirm} color="gray" variant="outline">
                Delete
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

export default DeleteContainerDialog;
