import { chakra, ChakraProps } from "@chakra-ui/react";
import { ReactNode } from "react";

// import { useSelection } from "../store";

interface VerseProps extends ChakraProps {
  children: ReactNode;
  verse: number;
}

const Verse = ({ children, verse, ...props }: VerseProps) => {
  // const [selection, setSelection] = useSelection();

  // const handleClick = () => {
  //   setSelection(selection === verse ? null : verse);
  // };

  return (
    <chakra.span
      pos="relative"
      // onClick={() => handleClick()}
      // borderBottom={selection === verse ? "2px dashed" : "none"}
      cursor="pointer"
      {...props}
    >
      {children}
    </chakra.span>
  );
};

export default Verse;
