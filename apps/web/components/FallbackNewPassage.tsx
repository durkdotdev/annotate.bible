import { Button, Heading, Text } from "@chakra-ui/react";

const FallbackNewPassage = () => {
  const newPassageBtnClick = () => {
    document.getElementById("new-passage-btn")?.click();
  };

  return (
    <Button
      alignItems="start"
      flexDir="column"
      gap="2"
      w="full"
      h="fit-content"
      p="4"
      onClick={() => newPassageBtnClick()}
      variant="outline"
    >
      <Heading
        as="h3"
        overflowX="hidden"
        w="full"
        fontSize="lg"
        fontWeight="medium"
        textAlign="left"
        textOverflow="ellipsis"
      >
        No Passages!
      </Heading>
      <Text
        as="span"
        display="block"
        color="base-text"
        fontSize="sm"
        fontWeight="light"
        textAlign="left"
        whiteSpace="normal"
      >
        <Text as="span" color="active" textDecor="underline">
          Create a new passage
        </Text>{" "}
        to annotate and share with others
      </Text>
    </Button>
  );
};

export default FallbackNewPassage;
