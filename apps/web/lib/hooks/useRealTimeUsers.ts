import { useEffect } from "react";

import {
  useColors,
  useHash,
  useProfile,
  useUsers,
  useUsersChannel
} from "../store";
import supabase from "../supabase";
import { getRandomAnimal } from "../utils";

const useRealTimeUsers = (id: null | string) => {
  const colors = useColors();
  const hash = useHash();
  const [profile] = useProfile();
  const [users, setUsers, resetUsers] = useUsers();
  const [usersChannel, setUsersChannel, resetUsersChannel] = useUsersChannel();

  useEffect(() => {
    if (id) {
      setUsersChannel(supabase.channel(`users:${id}`));
    }

    return () => {
      if (usersChannel) {
        supabase.removeChannel(usersChannel);
        resetUsers();
        resetUsersChannel();
      }
    };
  }, [id]);

  useEffect(() => {
    const updateUsersChannelProfileData = async () => {
      if (profile && usersChannel)
        await usersChannel.track({ ...profile, colors: colors, hash });
    };
    updateUsersChannelProfileData();
  }, [profile]);

  useEffect(() => {
    if (usersChannel)
      usersChannel
        .on("presence", { event: "sync" }, () => {
          const presenceUsers = [...users];
          const presenceState = usersChannel.presenceState();
          Object.keys(presenceState).forEach((presence) => {
            presenceState[presence].forEach((presenceUser) => {
              if (presenceUser.hash !== hash) presenceUsers.push(presenceUser);
            });
          });
          setUsers(presenceUsers);
        })
        .subscribe(async (status: string) => {
          if (status === "SUBSCRIBED") {
            const profileData = profile || {
              username: `Anonymous ${getRandomAnimal()}`
            };
            await usersChannel.track({ ...profileData, colors: colors, hash });
          }
        });
  }, [usersChannel]);
};

export default useRealTimeUsers;
