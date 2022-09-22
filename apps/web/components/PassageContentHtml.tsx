import { chakra } from "@chakra-ui/react";
import parse, {
  attributesToProps,
  domToReact,
  Element,
  HTMLReactParserOptions
} from "html-react-parser";

import { usePassageContentHtml } from "../lib/store";
import PassageVerse from "./PassageVerse";

const options: HTMLReactParserOptions = {
  replace: (domNode) => {
    if (domNode instanceof Element && domNode.attribs) {
      if (domNode.attribs.id) {
        const verse = parseInt(domNode.attribs.id.split(":").pop() as string);
        const props = attributesToProps(domNode.attribs);
        return (
          <PassageVerse verse={verse} {...props}>
            {domToReact(domNode.children)}
          </PassageVerse>
        );
      }
    }
  }
};

const PassageContentHTML = () => {
  const passageContentHtml = usePassageContentHtml();

  if (!passageContentHtml) return null;

  return (
    <>
      <chakra.article
        fontSize="lg"
        lineHeight="10"
        width="full"
        sx={{
          h2: {
            fontSize: "2xl",
            mb: "3"
          },
          h3: {
            fontWeight: "bold",
            mt: "5",
            mb: "3"
          },
          p: {
            py: 3
          },
          "> div > *": {
            marginTop: 0
          }
        }}
      >
        {parse(passageContentHtml, options)}
      </chakra.article>
    </>
  );
};

export default PassageContentHTML;
