import {
  Button,
  Collapse,
  Flex,
  Grid,
  GridItem,
  Heading,
  IconButton,
  LinkBox,
  LinkOverlay,
  Stack,
  Text,
  useDisclosure
} from "@chakra-ui/react";
import NextLink from "next/link";
import { ReactNode, useEffect, useState } from "react";
import {
  HiChevronDown,
  HiChevronLeft,
  HiChevronRight,
  HiChevronUp
} from "react-icons/hi";

import { useProfile } from "../lib/store";
import { findBookByAbbreviation, getTimeAgoString } from "../lib/utils";

interface ListPassageProps {
  collapsible?: boolean;
  fallback?: ReactNode;
  fetchPassages: (
    id: string,
    rangeStart: number,
    rangeEnd: number
  ) => Promise<any[] | undefined>;
  fetchPassagesCount: (id: string) => Promise<number | undefined>;
  label: string;
  pageCount?: number;
  showTimes?: boolean;
}

const ListPassages = ({
  collapsible,
  fallback,
  fetchPassages,
  fetchPassagesCount,
  label,
  pageCount = 6,
  showTimes = true
}: ListPassageProps) => {
  const [profile] = useProfile();

  const [count, setCount] = useState<number>();
  const [page, setPage] = useState<number>(0);
  const [passages, setPassages] = useState<any[]>();

  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });

  useEffect(() => {
    const callFetchPassagesCount = async () => {
      setCount(await fetchPassagesCount(profile?.id));
    };
    callFetchPassagesCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const callFetchPassages = async () => {
      setPassages(
        await fetchPassages(
          profile?.id,
          page * pageCount,
          (page + 1) * pageCount - 1
        )
      );
    };
    callFetchPassages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <Stack spacing="4">
      <Flex align="center" justify="space-between">
        <Heading as="h2" fontSize="lg" fontWeight="bold">
          {label}
        </Heading>
        {collapsible && (
          <IconButton
            aria-label={`collapse ${label.toLowerCase()}`}
            icon={isOpen ? <HiChevronUp /> : <HiChevronDown />}
            onClick={onToggle}
            variant="ghost"
          />
        )}
      </Flex>
      <Collapse animateOpacity in={isOpen}>
        <Stack spacing="4">
          <Grid
            gap="4"
            templateColumns={[
              "repeat(1, 1fr)",
              "repeat(2, 1fr)",
              "repeat(3, 1fr)"
            ]}
          >
            {passages && passages.length > 0 && (
              <>
                {passages.map((passage) => (
                  <LinkBox
                    key={passage.id}
                    as={GridItem}
                    overflowX="hidden"
                    colSpan="1"
                  >
                    <Button
                      as={Stack}
                      display="block"
                      w="full"
                      h="fit-content"
                      p="4"
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
                        <NextLink href={`/p?id="${passage.id}"`} passHref>
                          <LinkOverlay>
                            {passage.name ||
                              `${findBookByAbbreviation(passage.book)?.name} ${
                                passage.chapter
                              }`}
                          </LinkOverlay>
                        </NextLink>
                      </Heading>
                      {passage.description && (
                        <Text
                          color="base-text"
                          fontSize="sm"
                          fontWeight="light"
                          whiteSpace="normal"
                          noOfLines={3}
                        >
                          {passage.description}
                        </Text>
                      )}
                      {showTimes && (
                        <Text
                          as="span"
                          display="inline-block"
                          color="base-text"
                          fontSize="sm"
                          fontWeight="light"
                        >
                          • {getTimeAgoString(passage.updated_at)}
                        </Text>
                      )}
                    </Button>
                  </LinkBox>
                ))}
              </>
            )}
            {passages && passages.length === 0 && fallback}
          </Grid>
          {count && count > pageCount && (
            <Flex align="center" justify="end" gap="2">
              <IconButton
                aria-label="show previous passages"
                disabled={page === 0}
                icon={<HiChevronLeft />}
                onClick={() => setPage(page - 1)}
                size="sm"
              />
              <IconButton
                aria-label="show next passages"
                disabled={count ? page * pageCount + pageCount >= count : true}
                icon={<HiChevronRight />}
                onClick={() => setPage(page + 1)}
                size="sm"
              />
            </Flex>
          )}
        </Stack>
      </Collapse>
    </Stack>
  );
};

export default ListPassages;
