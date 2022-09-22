import { Flex, Spinner, useColorModeValue } from "@chakra-ui/react";

const AppLoading = () => {
  return (
    <Flex
      pos="absolute"
      top="0"
      left="0"
      align="center"
      justify="center"
      w="100vw"
      h="100vh"
    >
      <Spinner color={useColorModeValue("purple.500", "purple.300")} />
    </Flex>
  );
};

export default AppLoading;
