import { atom, useAtom } from "jotai";
import { atomFamily } from "jotai/utils";
import { Layout } from "react-grid-layout";

export const dbInstance = atom<any>(null);

/** -----------------------解锁------------------------------ */
export const lockAtom = atom<boolean>(true);
export const useLock = () => {
  const [isLock, setIsLock] = useAtom(lockAtom);

  const toggle = () => {
    setIsLock((prev) => !prev);
  };

  return { isLock, toggle };
};

/** -----------------------页面配置------------------------------- */

export interface LabelItemProps {
  label: string;
  key: string;
}

export interface LayoutItemProps extends LabelItemProps {
  id: string;
  componentList: ComponentItemProps[];
}

export interface ComponentItemProps {
  name: string;
  path: string;
  componentId: string;
  layout: Layout;
}

export const pageListAtom = atom<LayoutItemProps[]>([]);
export const usePageList = () => {
  const [pageList, setPageList] = useAtom(pageListAtom);

  return { pageList, setPageList };
};
const pageAtom = atomFamily((key: string) => {
  return atom((get) => {
    return get(pageListAtom).find((i) => i.key === key);
  });
});
export const useCurrentPageInfo = (key: string) => {
  const [val] = useAtom(pageAtom(key));
  return { currentPage: val };
};

export const currentPageKeyAtom = atom<string>("");
export const useCurrentPageKey = () => {
  const [key, setKey] = useAtom(currentPageKeyAtom);

  return { currentPageKey: key, setCurrentPageKey: setKey };
};

/** -------------------------组件列表弹窗------------------------------- */
const componentListModalVisibleAtom = atom<boolean>(false);
export const useComponentListModalVisible = () => {
  const [visible, setVisible] = useAtom(componentListModalVisibleAtom);

  const toggle = () => {
    setVisible((prev) => !prev);
  };

  return { visible, toggle, setVisible };
};
