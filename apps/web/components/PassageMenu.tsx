import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuList,
  Text,
  useBreakpointValue
} from "@chakra-ui/react";
import { HiChevronDown } from "react-icons/hi";
import { TbEdit } from "react-icons/tb";

import { usePassagePermission } from "../lib/store";
import PassageDeleteConfirmationModal from "./PassageDeleteConfirmationModal";
import PassageModal from "./PassageModal";
import PassagePermissionsModal from "./PassagePermissionsModal";

const PassageMenu = () => {
  const permission = usePassagePermission();

  return (
    <Menu placement="bottom-end">
      <MenuButton
        as={useBreakpointValue({ base: IconButton, md: Button })}
        color="base-text"
        icon={<TbEdit />}
        rightIcon={useBreakpointValue({ base: null, md: <HiChevronDown /> })}
        variant="outline"
      >
        <Text as="span" display={["none", "none", "inline-block"]}>
          Options
        </Text>
      </MenuButton>
      <MenuList maxW="60" mr="-12" p="0">
        <Box p="2">
          <PassageModal />
          <PassagePermissionsModal />
          {permission === "creator" && (
            <>
              <MenuDivider />
              <PassageDeleteConfirmationModal />
            </>
          )}
        </Box>
      </MenuList>
    </Menu>
  );
};

export default PassageMenu;
