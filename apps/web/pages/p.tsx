import { NextPage } from "next";

import PassageContentHTML from "../components/PassageContentHtml";
import PassageToolbar from "../components/PassageToolbar";
import useRealTimeUsers from "../lib/hooks/useRealTimeUsers";
import { usePassageId } from "../lib/store";

const Passage: NextPage = () => {
  const passageId = usePassageId();

  useRealTimeUsers(passageId);

  return (
    <>
      <PassageToolbar />
      <PassageContentHTML />
    </>
  );
};

export default Passage;
