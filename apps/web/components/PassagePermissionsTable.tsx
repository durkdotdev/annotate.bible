import {
  Divider,
  Flex,
  IconButton,
  Spacer,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { HiChevronLeft, HiChevronRight, HiX } from "react-icons/hi";

import { usePassage, useSession } from "../lib/store";
import supabase from "../lib/supabase";

interface PassagePermissionsTableProps {
  needsTableRefresh: boolean;
  setNeedsTableRefresh: Function;
}

const PassagePermissionsTable = ({
  needsTableRefresh,
  setNeedsTableRefresh
}: PassagePermissionsTableProps) => {
  const [passage] = usePassage();
  const session = useSession();

  const [count, setCount] = useState<number>();
  const [page, setPage] = useState<number>(0);
  const [permissions, setPermissions] = useState<any[]>();

  const toast = useToast();

  const fetchPermissions = async () => {
    if (session) {
      const { data } = await supabase
        .from("passage_permissions")
        .select("*, profiles(email)")
        .eq("passage_id", passage?.id)
        .in("permission", ["contributor"])
        .order("email", { foreignTable: "profiles" })
        .range(page * 5, (page + 1) * 5 - 1);
      setPermissions(data ? [...data] : []);
    }
  };

  const fetchPermissionsCount = async () => {
    const { data } = await supabase
      .from("passage_permissions")
      .select("*", { count: "exact" })
      .eq("passage_id", passage?.id);
    setCount(data?.length || 0);
  };

  const removePermission = async (userId: string) => {
    const { error } = await supabase
      .from("passage_permissions")
      .delete()
      .match({ passage_id: passage?.id, user_id: userId });
    if (error) {
      toast({
        description: "An error occurred, please try again",
        duration: 3500,
        status: "error",
        title: "There was a problem",
        variant: "solid"
      });
    } else {
      toast({
        description: "Successfully removed contributor's access",
        duration: 3500,
        status: "success",
        title: "Removed Contributor",
        variant: "solid"
      });

      if (count) setCount(count - 1);
      if (permissions)
        setPermissions([
          ...permissions?.filter((permission) => permission.user_id !== userId)
        ]);
    }
  };

  useEffect(() => {
    fetchPermissionsCount();
  }, []);

  useEffect(() => {
    fetchPermissions();
  }, [page, session]);

  useEffect(() => {
    if (needsTableRefresh) {
      fetchPermissionsCount();
      fetchPermissions();
      setNeedsTableRefresh(false);
    }
  }, [needsTableRefresh]);

  if (!permissions || permissions.length === 0) return null;

  return (
    <>
      <Spacer />
      <Divider />
      <Stack spacing="4">
        <TableContainer>
          <Table size="sm" style={{ tableLayout: "fixed" }}>
            <Thead>
              <Tr>
                <Th w="full" maxW="calc(100% - 92px)">
                  Email address
                </Th>
                <Th w="92px" isNumeric>
                  actions
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {permissions?.map((permission) => (
                <Tr key={permission.user_id}>
                  <Td overflow="hidden" textOverflow="ellipsis">
                    {permission.profiles.email}
                  </Td>
                  <Td isNumeric>
                    <IconButton
                      aria-label="delete access"
                      colorScheme="red"
                      icon={<HiX />}
                      onClick={() => removePermission(permission.user_id)}
                      size="xs"
                      variant="ghost"
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
        {permissions && permissions.length > 0 && (
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
              disabled={count ? page * 5 + 5 >= count : true}
              icon={<HiChevronRight />}
              onClick={() => setPage(page + 1)}
              size="sm"
            />
          </Flex>
        )}
      </Stack>
    </>
  );
};

export default PassagePermissionsTable;
