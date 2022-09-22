import {
  Avatar,
  AvatarGroup,
  Button,
  Flex,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Text
} from "@chakra-ui/react";

import { useUsers } from "../lib/store";

const UsersListPopover = () => {
  const [users] = useUsers();

  if (users.length === 0) return null;

  return (
    <Popover>
      <PopoverTrigger>
        <Button variant="ghost">
          <AvatarGroup max={2} size="sm">
            {users.map((user) => (
              <Avatar
                key={user.presence_ref}
                color={user.colors.text}
                bg={user.colors.background}
                borderColor={user.colors.background}
                name={user.username}
                src={user.avatar_url}
              />
            ))}
          </AvatarGroup>
        </Button>
      </PopoverTrigger>
      <PopoverContent maxW="60" mr="6" bg="base-modal">
        <PopoverBody overflowY="auto" maxH="50vh" p="2">
          <Stack>
            {users.map((user) => (
              <Flex key={user.presence_ref} align="center" gap="2">
                <Avatar
                  key={user.presence_ref}
                  color={user.colors.text}
                  bg={user.colors.background}
                  borderWidth="2px"
                  borderColor={user.colors.background}
                  name={user.username}
                  size="sm"
                  src={user.avatar_url}
                />
                <Text as="span" w="full" textOverflow="ellipsis" noOfLines={1}>
                  {user.username}
                </Text>
              </Flex>
            ))}
          </Stack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default UsersListPopover;
