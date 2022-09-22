import {
  Button,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Text,
  useDisclosure
} from "@chakra-ui/react";
import { useState } from "react";
import { HiOutlineChevronDown } from "react-icons/hi";

import { usePassage } from "../lib/store";
import { findBookByAbbreviation } from "../lib/utils";
import PassageSwitchConfirmationModal from "./PassageSwitchConfirmationModal";
import VersionBookSelect from "./VersionBookSelect";
import VersionChapterSelect from "./VersionChapterSelect";

const PassageSwitchPopup = () => {
  const [passage] = usePassage();

  const [book, setBook] = useState<string>(passage?.book);
  const [chapter, setChapter] = useState<number>(passage?.chapter);

  const { onOpen, onClose, isOpen } = useDisclosure();

  if (!passage) return null;

  return (
    <Popover
      isOpen={isOpen}
      onClose={onClose}
      onOpen={onOpen}
      placement="bottom-start"
    >
      <PopoverTrigger>
        <Button minW="16" rightIcon={<HiOutlineChevronDown size={14} />}>
          <Text as="span" display={["block", "block", "none"]}>
            {passage.book}.
          </Text>
          <Text as="span" display={["none", "none", "block"]}>
            {findBookByAbbreviation(passage.book)?.name}
          </Text>
          <Text as="span" ml="1">
            {passage.chapter}
          </Text>
        </Button>
      </PopoverTrigger>
      <PopoverContent left={["-10", "-10", "-12"]} p="2" bg="base-modal">
        <PopoverBody>
          <Stack as="form" spacing="4">
            <VersionBookSelect
              onChange={(event) => {
                setBook(event.target.value);
                setChapter(1);
              }}
              value={book}
            />
            <VersionChapterSelect
              book={book}
              onChange={(event) => setChapter(parseInt(event.target.value))}
              value={chapter}
            />
            <PassageSwitchConfirmationModal book={book} chapter={chapter} />
          </Stack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default PassageSwitchPopup;
