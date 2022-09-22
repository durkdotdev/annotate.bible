import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Stack,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import Router from "next/router";
import { FormEvent, useState } from "react";
import { HiPlus } from "react-icons/hi";

import { useProfile } from "../lib/store";
import supabase from "../lib/supabase";
import VersionBookSelect from "./VersionBookSelect";
import VersionChapterSelect from "./VersionChapterSelect";

const DEFAULT_BOOK = "Gen";
const DEFAULT_CHAPTER = 1;

const NewPassageModal = () => {
  const [profile] = useProfile();

  const [book, setBook] = useState(DEFAULT_BOOK);
  const [chapter, setChapter] = useState(DEFAULT_CHAPTER);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleClose = () => {
    if (book !== DEFAULT_BOOK) setBook(DEFAULT_BOOK);
    if (chapter !== DEFAULT_CHAPTER) setChapter(DEFAULT_CHAPTER);
    onClose();
  };

  const handleSubmit = async (event: FormEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const passage: any = { book, chapter };
    if (profile?.id) passage.user_id = profile.id;
    const { data, error } = await supabase
      .from("passages")
      .insert([passage])
      .select("id")
      .single();
    if (error)
      toast({
        description: "An error occurred, please try again",
        duration: 3500,
        status: "error",
        title: "There was a problem",
        variant: "solid"
      });

    setIsLoading(false);
    if (data) Router.push({ pathname: "/p", query: { id: `"${data.id}"` } });
  };

  return (
    <>
      <Button id="new-passage-btn" leftIcon={<HiPlus />} onClick={onOpen}>
        Passage
      </Button>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(10px) hue-rotate(10deg)"
        />
        <ModalContent>
          <ModalBody p={["4", "4", "6"]}>
            <Stack as="form" onSubmit={handleSubmit} spacing="4">
              <VersionBookSelect
                onChange={(event) => setBook(event.target.value)}
                value={book}
              />
              <VersionChapterSelect
                book={book}
                onChange={(event) => setChapter(parseInt(event.target.value))}
                value={chapter}
              />
              <Button
                colorScheme="purple"
                isLoading={isLoading}
                loadingText="Creating"
                type="submit"
              >
                Read Passage
              </Button>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NewPassageModal;
