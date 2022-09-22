import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  MenuItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Stack,
  Textarea,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import { FormEvent, useState } from "react";

import { usePassage } from "../lib/store";
import supabase from "../lib/supabase";

const PassageModal = () => {
  const [passage] = usePassage();

  const [description, setDescription] = useState<string | null>(
    passage?.description
  );
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [name, setName] = useState<string | null>(passage?.name || "");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const reset = () => {
    setName(passage?.name || "");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (event: FormEvent<HTMLDivElement>) => {
    event.preventDefault();
    setError(undefined);
    setIsLoading(true);

    if (name && name.length > 0 && name.length < 4) {
      setIsLoading(false);
      return setError("Passage names must be at least 4 characters");
    }

    const updates = {
      description: description?.length === 0 ? null : description,
      name: name?.length === 0 ? null : name
    };

    const { error } = await supabase
      .from("passages")
      .update(updates)
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
        description: "Your passage was successfully updated",
        duration: 3500,
        status: "success",
        title: "Updated Passage",
        variant: "solid"
      });
      onClose();
    }
    setIsLoading(false);
  };

  return (
    <>
      <MenuItem
        as={Button}
        justifyContent="end"
        fontWeight="normal"
        onClick={onOpen}
        variant="ghost"
      >
        Settings
      </MenuItem>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(10px) hue-rotate(10deg)"
        />
        <ModalContent>
          <ModalBody p={["4", "4", "6"]}>
            <Stack as="form" align="center" onSubmit={handleSubmit} spacing="4">
              <FormControl isInvalid={error !== undefined}>
                <FormLabel>Name</FormLabel>
                <Input
                  onChange={(event) => setName(event.target.value)}
                  value={name || ""}
                />
                {error && <FormErrorMessage>{error}</FormErrorMessage>}
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  h="24"
                  resize="none"
                  maxLength={150}
                  onChange={(event) => setDescription(event.target.value)}
                  value={description || ""}
                />
                <FormHelperText textAlign="right">
                  {description?.length || 0}/150
                </FormHelperText>
              </FormControl>
              <Button
                w="full"
                colorScheme="violet"
                isLoading={isLoading}
                loadingText="Saving"
                type="submit"
              >
                Save Changes
              </Button>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PassageModal;
