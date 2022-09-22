import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Stack,
  useClipboard,
  useDisclosure
} from "@chakra-ui/react";
import { HiCheck } from "react-icons/hi";
import { MdOutlineIosShare } from "react-icons/md";
import { APP_URL } from "sdk";

import { usePassageId } from "../lib/store";

const SharePassageModal = () => {
  const passageId = usePassageId();

  const shareUrl = `${APP_URL}/p?id="${passageId}"`;
  const { hasCopied, onCopy } = useClipboard(shareUrl);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <IconButton
        color="base-text"
        aria-label="share passage"
        icon={<MdOutlineIosShare />}
        onClick={onOpen}
        variant="outline"
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(10px) hue-rotate(10deg)"
        />
        <ModalContent>
          <ModalBody p={["4", "4", "6"]}>
            <Stack spacing="4">
              <Flex align="end" direction="row-reverse" gap="2">
                <Button colorScheme="purple" onClick={onCopy} variant="outline">
                  {hasCopied ? <HiCheck /> : "Copy"}
                </Button>
                <FormControl>
                  <FormLabel>Shareable Link</FormLabel>
                  <Input
                    bg="base-alt"
                    textOverflow="ellipsis"
                    isReadOnly
                    value={shareUrl}
                  />
                </FormControl>
              </Flex>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SharePassageModal;
