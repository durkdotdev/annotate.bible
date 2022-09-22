import { Box, Flex, FlexProps } from "@chakra-ui/react";

const Page = ({ children, ...props }: Partial<FlexProps>) => {
  return (
    <Flex justify="center" h="full" px="6" py="6" {...props}>
      <Box w="full" maxW="3xl">
        {children}
      </Box>
    </Flex>
  );
};

export default Page;
