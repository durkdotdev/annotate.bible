import {
  Button,
  Flex,
  MenuItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import Router from "next/router";
import { FormEvent, useState } from "react";

import { usePassage } from "../lib/store";
import supabase from "../lib/supabase";

const PassageDeleteConfirmationModal = () => {
  const [passage] = usePassage();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const toast = useToast();

  const handleSubmit = async (event: FormEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const { error } = await supabase
      .from("passages")
      .delete()
      .eq("id", passage?.id);
    if (error) {
      toast({
        description: "An error occurred, please try again",
        duration: 3500,
        status: "error",
        title: "There was a problem",
        variant: "solid"
      });
    } else {
      toast({
        description: "Your passage was successfully deleted",
        duration: 3500,
        status: "success",
        title: "Deleted Passage",
        variant: "solid"
      });
      Router.push("/");
    }
    setIsLoading(false);
  };

  return (
    <>
      <MenuItem
        as={Button}
        justifyContent="end"
        fontSize="sm"
        fontWeight="light"
        onClick={onOpen}
        variant="ghost"
      >
        Delete Passage
      </MenuItem>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(10px) hue-rotate(10deg)"
        />
        <ModalContent>
          <ModalBody p={["4", "4", "6"]}>
            <Stack as="form" onSubmit={handleSubmit} spacing="4">
              <Text>Confirm that you want to delete:</Text>
              <Flex align="center" gap="4" w="full">
                <Button
                  w="full"
                  colorScheme="red"
                  isLoading={isLoading}
                  loadingText="Deleting"
                  type="submit"
                >
                  Delete
                </Button>
                <Button
                  w="full"
                  onClick={onClose}
                  type="button"
                  variant="outline"
                >
                  Cancel
                </Button>
              </Flex>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PassageDeleteConfirmationModal;
