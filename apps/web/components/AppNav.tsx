import { Flex, Spacer, useColorModeValue } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { useSession } from "../lib/store";
import ThemeButton from "./AppThemeButton";
import NewPassageModal from "./NewPassageModal";
import PassageLookup from "./PassageLookup";
import PassageSelectPopup from "./PassageSwitchPopup";
import ProfileMenu from "./ProfileMenu";
import SignInModal from "./SignInModal";

const AppNav = () => {
  const session = useSession();

  const pathname = useRouter().pathname;

  return (
    <Flex justify="center">
      <Flex align="center" gap="6" w="full" maxW="2xl" px="6" py="3">
        <Link href="/" passHref>
          <Flex as="a" align="center">
            <Image
              alt="logo"
              height={30}
              src={`/assets/logo_${useColorModeValue("dark", "light")}.svg`}
              width={20}
            />
          </Flex>
        </Link>
        {session && pathname === "/" && <NewPassageModal />}
        {pathname === "/p" ? (
          session ? (
            <PassageSelectPopup />
          ) : (
            <PassageLookup />
          )
        ) : null}
        <Spacer />
        {session ? <ProfileMenu /> : <SignInModal />}
        <ThemeButton />
      </Flex>
    </Flex>
  );
};

export default AppNav;
