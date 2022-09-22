import { FormControl, FormLabel, Select, SelectProps } from "@chakra-ui/react";
import { Suspense } from "react";

import { useBooks } from "../lib/store";

interface VersionChapterSelectProps extends SelectProps {
  book: string;
}

const VersionChapterSelect = ({
  book,
  ...props
}: VersionChapterSelectProps) => {
  const books = useBooks();
  const chapters = books?.find((b) => b.abbreviation === book)?.chapters || 0;

  return (
    <Suspense>
      <FormControl isRequired>
        <FormLabel>Chapter</FormLabel>
        <Select {...props}>
          {Array.from({ length: chapters }, (_, i) => i + 1).map((chapter) => (
            <option key={chapter} value={chapter}>
              {chapter}
            </option>
          ))}
        </Select>
      </FormControl>
    </Suspense>
  );
};

export default VersionChapterSelect;
