import {
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text
} from "@chakra-ui/react";
import Router from "next/router";
import { HiOutlineExternalLink } from "react-icons/hi";

import { useProfile } from "../lib/store";
import supabase from "../lib/supabase";
import ProfileAvatar from "./ProfileAvatar";
import ProfileModal from "./ProfileModal";

const handleSignOut = async () => {
  await supabase.auth.signOut();
  Router.reload();
};

const ProfileMenu = () => {
  const [profile] = useProfile();

  return (
    <Menu placement="bottom-end">
      <MenuButton p="0">
        <ProfileAvatar mx="1" size="sm" />
      </MenuButton>
      <MenuList maxW="60" mt="1" mr="-12" p="0">
        <Flex
          align="center"
          justify="end"
          gap="4"
          px="4"
          py="2"
          borderTopRadius="md"
        >
          <ProfileAvatar mx="1" size="xs" />
          <Text
            as="span"
            flexGrow="1"
            flexBasis="1"
            fontWeight="bold"
            textAlign="right"
            noOfLines={1}
          >
            {profile?.username}
          </Text>
        </Flex>
        <Box p="2">
          <ProfileModal />
          <MenuDivider />
          <MenuItem
            as={Button}
            justifyContent="end"
            fontSize="sm"
            fontWeight="light"
            borderRadius="md"
            onClick={() => handleSignOut()}
            rightIcon={<HiOutlineExternalLink />}
            variant="ghost"
          >
            Sign Out
          </MenuItem>
        </Box>
      </MenuList>
    </Menu>
  );
};

export default ProfileMenu;
