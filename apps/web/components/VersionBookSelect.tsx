import { FormControl, FormLabel, Select, SelectProps } from "@chakra-ui/react";

import { useBooks } from "../lib/store";

const VersionBookSelect = ({ ...props }: SelectProps) => {
  const books = useBooks();

  return (
    <FormControl isRequired>
      <FormLabel>Book</FormLabel>
      <Select {...props}>
        {books?.map((book) => (
          <option key={book.abbreviation} value={book.abbreviation}>
            {book.name}
          </option>
        ))}
      </Select>
    </FormControl>
  );
};

export default VersionBookSelect;
