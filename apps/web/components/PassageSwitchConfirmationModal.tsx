import {
  Button,
  Flex,
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

import { usePassage } from "../lib/store";
import supabase from "../lib/supabase";

interface PassageSwitchConfirmationModalProps {
  book: string;
  chapter: number;
}

const PassageSwitchConfirmationModal = ({
  book,
  chapter
}: PassageSwitchConfirmationModalProps) => {
  const [passage] = usePassage();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleSubmit = async (event: FormEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsLoading(true);

    console.log(book, chapter);

    const { error } = await supabase
      .from("passages")
      .update({ book, chapter })
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
      <Button
        w="full"
        colorScheme="purple"
        isDisabled={passage?.book === book && passage.chapter === chapter}
        onClick={onOpen}
        type="button"
      >
        Switch Passage
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(10px) hue-rotate(10deg)"
        />
        <ModalContent>
          <ModalBody p={["4", "4", "6"]}>
            <Stack as="form" onSubmit={handleSubmit} spacing="4">
              <Text>Confirm that you want to switch this passage:</Text>
              <Flex align="center" gap="4" w="full">
                <Button
                  w="full"
                  colorScheme="purple"
                  isLoading={isLoading}
                  loadingText="Deleting"
                  type="submit"
                >
                  Switch Passage
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
              <Text
                as="span"
                color="base-text"
                fontSize="sm"
                fontWeight="light"
              >
                <strong>Note</strong>: any annotations and comments will be
                removed
              </Text>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PassageSwitchConfirmationModal;
