import { Box, Flex, Spacer, Text } from "@chakra-ui/react";

import { usePassage, usePassagePermission } from "../lib/store";
import PassageMenu from "./PassageMenu";
import PassageShareModal from "./PassageShareModal";
import UsersListPopover from "./UsersListPopover";

const PassageToolbar = () => {
  const permission = usePassagePermission();
  const [passage] = usePassage();

  return (
    <Flex justify="center" py={["2", "2", "3"]}>
      <Flex align="center" gap="2" w="full" maxW="3xl">
        {passage?.name && (
          <Box display={["none", "block", "block"]}>
            <Text as="span" fontSize="lg" fontWeight="bold" noOfLines={1}>
              {passage.name}
            </Text>
          </Box>
        )}
        <Spacer />
        <UsersListPopover />
        {permission && permission !== "visitor" && <PassageMenu />}
        <PassageShareModal />
      </Flex>
    </Flex>
  );
};

export default PassageToolbar;
