import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Link,
  MenuItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Stack,
  useColorModeValue,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import { ChangeEvent, FormEvent, useRef, useState } from "react";

import { useProfile } from "../lib/store";
import supabase from "../lib/supabase";
import ProfileAvatar from "./ProfileAvatar";

const ProfileModal = () => {
  const [profile] = useProfile();

  const ref = useRef<null | HTMLInputElement>(null);
  const [base64, setBase64] = useState<string>();
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uploaded, setUploaded] = useState<Blob>();
  const [username, setUsername] = useState<string>(profile?.username || "");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const reset = () => {
    if (base64) setBase64(undefined);
    if (uploaded) setUploaded(undefined);
    if (username !== profile?.username) setUsername(profile?.username || "");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => setBase64(reader.result as string);
      setUploaded(file);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLDivElement>) => {
    event.preventDefault();
    setError(undefined);
    setIsLoading(true);

    if (username.length < 4) {
      setError("Usernames must be at least 4 characters");
      return setIsLoading(false);
    } else if (!/^[\w\_\s]+$/.test(username)) {
      setError(
        "Usernames may only include letters, numbers, spaces, and underscores"
      );
      return setIsLoading(false);
    }

    const updates: any = {
      id: profile?.id,
      username
    };

    if (uploaded) {
      const path = `${profile?.id}:${Date.now()}`;
      if (profile?.avatar_url) {
        await supabase.storage
          .from("avatars")
          .remove([profile.avatar_url.split("/").pop() as string]);
      }
      const { error } = await supabase.storage
        .from("avatars")
        .upload(path, uploaded);
      if (error) {
        toast({
          description: "An error occurred while uploading, please try again",
          duration: 3500,
          status: "error",
          title: "",
          variant: "solid"
        });
      }

      const {
        data: { publicUrl }
      } = supabase.storage.from("avatars").getPublicUrl(path);
      updates.avatar_url = publicUrl;
    }

    const { error } = await supabase.from("profiles").update(updates);
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
        description: "Your profile was successfully updated",
        duration: 3500,
        status: "success",
        title: "Updated Profile",
        variant: "solid"
      });
    }

    setIsLoading(false);
  };

  return (
    <>
      <MenuItem
        as={Button}
        justifyContent="end"
        fontWeight="normal"
        onClick={onOpen}
        variant="ghost"
      >
        My Profile
      </MenuItem>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(10px) hue-rotate(10deg)"
        />
        <ModalContent>
          <ModalBody p={["4", "4", "6"]}>
            <Stack as="form" align="center" onSubmit={handleSubmit} spacing="4">
              <ProfileAvatar base64={base64} size="2xl" />
              <Link
                as="button"
                color={useColorModeValue("blue.500", "blue.200")}
                fontSize="sm"
                fontWeight="medium"
                onClick={() => {
                  if (ref && ref.current) ref.current.click();
                }}
                type="button"
              >
                Upload Image
              </Link>
              <Input
                ref={ref}
                display="none"
                accept="image/*"
                onChange={handleUpload}
                type="file"
              />
              <FormControl isInvalid={error !== undefined} isRequired>
                <FormLabel>Username</FormLabel>
                <Input
                  onChange={(event) => setUsername(event.target.value)}
                  value={username}
                />
                {error && <FormErrorMessage>{error}</FormErrorMessage>}
              </FormControl>
              <Button
                w="full"
                colorScheme="violet"
                isLoading={isLoading}
                loadingText="Saving"
                type="submit"
              >
                Save Changes
              </Button>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
