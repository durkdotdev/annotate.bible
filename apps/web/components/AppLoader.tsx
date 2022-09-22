import { ReactNode, useEffect, useState } from "react";

import AppLoading from "./AppLoading";

interface AppLoaderProps {
  children: ReactNode;
}

const AppLoader = ({ children }: AppLoaderProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    return () => {
      setMounted(false);
    };
  }, []);

  if (!mounted) return <AppLoading />;

  return <>{children}</>;
};

export default AppLoader;
