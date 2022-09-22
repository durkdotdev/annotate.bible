import { ChakraProvider } from "@chakra-ui/react";
import chakraTheme from "configs/chakra";
import { AppProps } from "next/app";
import { Suspense } from "react";
import { RecoilRoot } from "recoil";
import { RecoilURLSyncJSONNext } from "recoil-sync-next";

import AppLoader from "../components/AppLoader";
import AppLoading from "../components/AppLoading";
import AppNav from "../components/AppNav";
import AppPage from "../components/AppPage";

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  return (
    <ChakraProvider theme={chakraTheme}>
      <RecoilRoot>
        <RecoilURLSyncJSONNext location={{ part: "queryParams" }}>
          <Suspense fallback={<AppLoading />}>
            <AppLoader>
              <AppNav />
              <AppPage>
                <Component {...pageProps} />
              </AppPage>
            </AppLoader>
          </Suspense>
        </RecoilURLSyncJSONNext>
      </RecoilRoot>
    </ChakraProvider>
  );
};

export default MyApp;
