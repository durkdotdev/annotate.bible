import { Stack, Text } from "@chakra-ui/react";
import { NextPage } from "next";

import FallbackNewPassage from "../components/FallbackNewPassage";
import ListPassages from "../components/ListPassages";
import { useSession } from "../lib/store";
import supabase from "../lib/supabase";

const fetchPassages = async (
  user_id: string,
  rangeStart: number,
  rangeEnd: number
) =>
  (
    await supabase
      .from("passages")
      .select()
      .eq("user_id", user_id)
      .order("updated_at", { ascending: false })
      .range(rangeStart, rangeEnd)
  ).data;
const fetchPassagesCount = async (user_id: string) =>
  (
    await supabase
      .from("passages")
      .select("*", { count: "exact" })
      .eq("user_id", user_id)
  ).data?.length;

const fetchSharedPassages = async (
  user_id: string,
  rangeStart: number,
  rangeEnd: number
) =>
  (
    await supabase
      .from("passage_permissions")
      .select("*, passages(*)", { count: "exact" })
      .eq("user_id", user_id)
      .filter("permission", "in", '("contributor")')
      .order("updated_at", { ascending: false, foreignTable: "passages" })
      .range(rangeStart, rangeEnd)
  ).data;
const fetchSharedPassagesCount = async (user_id: string) =>
  (
    await supabase
      .from("passage_permissions")
      .select("*", { count: "exact" })
      .eq("user_id", user_id)
      .filter("permission", "in", '("contributor")')
  ).data?.length;

const fetchFeaturedPassages = async (
  _: string,
  rangeStart: number,
  rangeEnd: number
) =>
  (
    await supabase
      .from("passages")
      .select()
      .match({ featured: true })
      .order("updated_at", { ascending: false })
      .range(rangeStart, rangeEnd)
  ).data;
const fetchFeaturedpassagesCount = async () =>
  (
    await supabase
      .from("passages")
      .select("*", { count: "exact" })
      .match({ featured: true })
  ).data?.length;

const Index: NextPage = () => {
  const session = useSession();

  return (
    <>
      <Stack spacing="12">
        {session && (
          <>
            <ListPassages
              fallback={<FallbackNewPassage />}
              fetchPassages={fetchPassages}
              fetchPassagesCount={fetchPassagesCount}
              label="My Passages"
            />
            <ListPassages
              fallback={
                <Text color="base-text" fontSize="sm" fontWeight="light">
                  When passages are shared with you, they will appear here
                </Text>
              }
              fetchPassages={fetchSharedPassages}
              fetchPassagesCount={fetchSharedPassagesCount}
              label="Shared Passages"
            />
          </>
        )}
        <ListPassages
          collapsible
          fetchPassages={fetchFeaturedPassages}
          fetchPassagesCount={fetchFeaturedpassagesCount}
          label="Featured Passages"
          pageCount={3}
          showTimes={false}
        />
      </Stack>
    </>
  );
};

export default Index;
