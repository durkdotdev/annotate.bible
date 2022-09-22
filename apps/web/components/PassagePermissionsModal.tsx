import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
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
import { FormEvent, useState } from "react";

import { usePassage, usePassagePermission } from "../lib/store";
import supabase from "../lib/supabase";
import PassagePermissionsTable from "./PassagePermissionsTable";

const PassagePermissionsModal = () => {
  const [passage] = usePassage();
  const permission = usePassagePermission();

  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [needsTableRefresh, setNeedsTableRefresh] = useState<boolean>(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const reset = () => {
    setEmail("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (event: FormEvent<HTMLDivElement>) => {
    event.preventDefault();
    setError(undefined);
    setIsLoading(true);

    const { data: potentialUserData } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .single();

    if (potentialUserData === undefined) {
      setError("No user with that email address exists, please try again");
      return setIsLoading(false);
    }

    const { error } = await supabase.from("passage_permissions").insert({
      passage_id: passage?.id,
      user_id: potentialUserData.id,
      permission: "contributor"
    });
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
        description: "Successfully added contributor",
        duration: 3500,
        status: "success",
        title: "Added Contributor",
        variant: "solid"
      });
      reset();
      setNeedsTableRefresh(true);
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
        Manage Access
      </MenuItem>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(10px) hue-rotate(10deg)"
        />
        <ModalContent>
          <ModalBody p={["4", "4", "6"]}>
            <Stack spacing="4">
              <Stack as="form" onSubmit={handleSubmit} spacing="4">
                <Text
                  as="span"
                  mb="-2"
                  color="base-text"
                  fontSize="sm"
                  fontWeight="light"
                >
                  Enter an email address to add that user as a contributor
                </Text>
                <FormControl isInvalid={error !== undefined} isRequired>
                  <FormLabel>Email Address</FormLabel>
                  <Input
                    onChange={(event) => setEmail(event.target.value)}
                    type="email"
                    value={email}
                  />
                  {error && <FormErrorMessage>{error}</FormErrorMessage>}
                </FormControl>
                <Button
                  colorScheme="purple"
                  isLoading={isLoading}
                  loadingText="Adding User"
                  type="submit"
                >
                  Add Contributor
                </Button>
              </Stack>
              {permission === "creator" && (
                <PassagePermissionsTable
                  needsTableRefresh={needsTableRefresh}
                  setNeedsTableRefresh={setNeedsTableRefresh}
                />
              )}
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PassagePermissionsModal;
