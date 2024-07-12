import { LayoutItemProps, dbInstance, usePageList } from "src/models/store";
import { useAsyncEffect } from "ahooks";
import { useAtom } from "jotai";
import { DB_STORE } from "src/const/enum";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import Header from "./header";
import DoTabs from "./tabs";
import ComponentLayout from "./component-layout";
import ComponentListModal from "./component-list-modal";
import { tw } from "twind";

const Trade = () => {
  const [dbIns] = useAtom(dbInstance);
  const { setPageList } = usePageList();
  useAsyncEffect(async () => {
    if (dbIns) {
      const res: LayoutItemProps[] = await dbIns.getAll(DB_STORE.LAYOUT);

      setPageList(res || []);
    }
  }, [dbIns]);

  return (
    <div className={tw`h-full w-full flex flex-col`}>
      <Header />
      <DoTabs />
      <ComponentLayout />

      <ComponentListModal />
    </div>
  );
};
export default Trade;
