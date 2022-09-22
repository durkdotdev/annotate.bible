import {
  Button,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Stack,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import { Provider } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import { FaGoogle, FaTwitter } from "react-icons/fa";

import { useSession } from "../lib/store";
import supabase from "../lib/supabase";

const oauths = [
  {
    colorScheme: "red",
    icon: FaGoogle,
    platform: "Google",
    provider: "google"
  },
  {
    colorScheme: "twitter",
    icon: FaTwitter,
    platform: "Twitter",
    provider: "twitter"
  }
];

const oAuthLogin = async (provider: string) => {
  await supabase.auth.signInWithOAuth({ provider: provider as Provider });
};

const SignInModal = () => {
  const session = useSession();

  const [email, setEmail] = useState<string>("");
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleClose = () => {
    setEmail("");
    onClose();
  };

  const handleSubmit = async (event: FormEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
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
        description: "Check your email for a link to sign in",
        duration: 3500,
        status: "success",
        title: "Email Sent",
        variant: "solid"
      });
      setEmail("");
      onClose();
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (router.query.signIn === "y") {
      if (!hasStarted && !session) {
        setHasStarted(true);
        onClose();
      }
      router.push(
        {
          pathname: router.pathname
        },
        undefined,
        { shallow: true }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  if (session) return null;

  return (
    <>
      <Button colorScheme="purple" onClick={onOpen}>
        Sign In
      </Button>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(10px) hue-rotate(10deg)"
        />
        <ModalContent>
          <ModalBody p={["4", "4", "6"]}>
            <Stack spacing="4">
              <Stack as="form" onSubmit={handleSubmit} spacing="4">
                <FormControl isRequired>
                  <FormLabel>Email Address</FormLabel>
                  <Input
                    onChange={(event) => setEmail(event.target.value)}
                    value={email}
                  />
                </FormControl>
                <Button
                  colorScheme="violet"
                  isLoading={isLoading}
                  loadingText="Sending Link"
                  type="submit"
                >
                  Send Email Link
                </Button>
              </Stack>
              <Divider />
              <Stack spacing="4">
                {oauths.map((oauth) => (
                  <Button
                    key={oauth.platform}
                    colorScheme={oauth.colorScheme}
                    leftIcon={<oauth.icon />}
                    onClick={() => oAuthLogin(oauth.provider)}
                  >
                    Continue with {oauth.platform}
                  </Button>
                ))}
              </Stack>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SignInModal;
