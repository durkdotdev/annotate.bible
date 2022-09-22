import refine from "@recoiljs/refine";
import { RealtimeChannel } from "@supabase/supabase-js";
import {
  atom,
  AtomEffect,
  Resetter,
  selector,
  SetterOrUpdater,
  useRecoilState,
  useRecoilValue,
  useResetRecoilState
} from "recoil";
import { syncEffect } from "recoil-sync";

import supabase, { lookupSupabase } from "./supabase";
import { getRandomHash, getRandomUserColors } from "./utils";

const localStorageEffect =
  (key: string) =>
    ({ setSelf, onSet }: { setSelf: Function; onSet: Function }) => {
      const savedValue = localStorage.getItem(key);
      if (savedValue != null) {
        setSelf(JSON.parse(savedValue));
      }

      onSet((newValue: string, _: Function, isReset: boolean) => {
        isReset
          ? localStorage.removeItem(key)
          : localStorage.setItem(key, JSON.stringify(newValue));
      });
    };
const { string } = refine;

const version = atom({
  key: "version",
  default: "NABRE",
  effects: [localStorageEffect("version")]
});
export const useVersion = () => useRecoilState(version);

const books = selector({
  key: "books",
  get: async ({ get }) =>
    (await lookupSupabase.from(`${get(version)}-books`).select()).data
});
export const useBooks = () => useRecoilValue(books);

const session = selector({
  key: "session",
  get: async () => (await supabase.auth.getSession()).data.session
});
export const useSession = () => useRecoilValue(session);

const profile = atom({
  key: "profile",
  default: selector({
    key: "profileInit",
    get: async ({ get }) => {
      const id = get(session)?.user.id;
      if (!id) return null;
      return (
        await supabase
          .from("profiles")
          .select("id, avatar_url, username")
          .eq("id", id)
          .single()
      ).data;
    }
  })
});
export const useProfile = () => useRecoilState(profile);

const passagePermission = selector({
  key: "passagePermission",
  get: async ({ get }) => {
    const id = get(passageId);
    if (!id) return null;
    const sessionData = get(session);
    if (!sessionData) return "visitor";
    return (
      await supabase
        .from("passage_permissions")
        .select("permission")
        .match({ passage_id: id, user_id: sessionData.user.id })
        .single()
    ).data?.permission;
  }
});
export const usePassagePermission = () => useRecoilValue(passagePermission);

const passageId = atom<null | string>({
  key: "id",
  default: null,
  effects: [syncEffect({ refine: string() }) as AtomEffect<null | string>]
});
export const usePassageId = () => useRecoilValue(passageId);

const passage = atom({
  key: "passage",
  default: selector({
    key: "passageInit",
    get: async ({ get }) => {
      const id = get(passageId);
      if (!id) return null;
      return (
        await supabase
          .from("passages")
          .select("id, book, chapter, description, name")
          .eq("id", id)
          .single()
      ).data;
    }
  })
});
export const usePassage = () => useRecoilState(passage);

const passageContentHtml = selector({
  key: "passageContentHtml",
  get: async ({ get }) => {
    const passageData = get(passage);
    if (!passageData) return null;
    return (
      await lookupSupabase
        .from(`${get(version)}-chapters`)
        .select("content_html")
        .match({ book: passageData.book, chapter: passageData.chapter })
        .single()
    ).data?.content_html;
  }
});
export const usePassageContentHtml = () => useRecoilValue(passageContentHtml);

const colors = atom({ key: "colors", default: getRandomUserColors() });
export const useColors = () => useRecoilValue(colors);

const hash = atom({ key: "hash", default: getRandomHash() });
export const useHash = () => useRecoilValue(hash);

const users = atom<any[]>({ key: "users", default: [] });
export const useUsers = (): [any[], SetterOrUpdater<any[]>, Resetter] => {
  const [state, set] = useRecoilState(users);
  return [state, set, useResetRecoilState(users)];
};

const usersChannel = atom<null | RealtimeChannel>({
  key: "usersChannel",
  default: null,
  dangerouslyAllowMutability: true
});
export const useUsersChannel = (): [
  null | RealtimeChannel,
  SetterOrUpdater<null | RealtimeChannel>,
  Resetter
] => [...useRecoilState(usersChannel), useResetRecoilState(usersChannel)];
