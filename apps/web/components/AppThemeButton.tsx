import { IconButton, useColorMode } from "@chakra-ui/react";
import { FaMoon, FaSun } from "react-icons/fa";

const ThemeButton = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <IconButton
      ml={["-2", "-2", "-4"]}
      color="base-text"
      aria-label={`switch to ${colorMode} theme`}
      icon={colorMode === "light" ? <FaMoon size={14} /> : <FaSun size={14} />}
      onClick={toggleColorMode}
      variant="ghost"
    />
  );
};

export default ThemeButton;
