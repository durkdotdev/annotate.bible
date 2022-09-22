import { Button, Text } from "@chakra-ui/react";

import { usePassage } from "../lib/store";
import { findBookByAbbreviation } from "../lib/utils";

const PassageLookup = () => {
  const [passage] = usePassage();

  if (!passage) return null;

  return (
    <Button as="div" minW="16" _hover={{ bg: "base" }} variant="outline">
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
  );
};

export default PassageLookup;
