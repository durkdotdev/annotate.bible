import { Avatar, AvatarProps } from "@chakra-ui/react";

import { useProfile } from "../lib/store";

interface UserAvatarProps extends Partial<AvatarProps> {
  base64?: string;
}

const ProfileAvatar = ({ base64, ...props }: UserAvatarProps) => {
  const [profile] = useProfile();

  if (!profile) return null;

  return (
    <Avatar
      name={profile.username}
      src={
        base64 ? base64 : profile.avatar_url ? profile.avatar_url : undefined
      }
      {...props}
    />
  );
};

export default ProfileAvatar;
