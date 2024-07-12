import { AppstoreOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { useAtom } from "jotai";
import { Layout } from "react-grid-layout";

import { componentConfig, componentItem } from "src/const/componentConfig";
import { DB_STORE } from "src/const/enum";
import {
  dbInstance,
  useComponentListModalVisible,
  useCurrentPageKey,
  usePageList,
} from "src/models/store";
import { tw } from "twind";

import { v6 as uuid } from "uuid";

const ComponentListModal = () => {
  const { currentPageKey } = useCurrentPageKey();
  const { pageList, setPageList } = usePageList();
  const [dbIns] = useAtom(dbInstance);
  const { visible, toggle } = useComponentListModalVisible();
  const calcX = (component: componentItem) => {
    const { w } = component;

    const page = pageList.find((page) => page.key === currentPageKey);
    const comList = page?.componentList;

    if (comList) {
      const {
        x: lastX,
        y: lastY,
        w: lastW,
        h: lastH,
      } = comList[comList.length - 1].layout;
      const res = {
        x: lastX + lastW,
        y: lastY + lastH,
      };

      if (24 - (lastX + lastW) < w) {
        res.x = 0;
      }

      return res;
    }

    return {
      x: 0,
      y: 0,
    };
  };

  const addComponet2Page = (component: componentItem) => {
    const page = pageList.find((page) => page.key === currentPageKey);

    if (page) {
      const componentId = uuid();

      const comList = page?.componentList;

      const currentPosition = calcX(component);
      comList?.push({
        componentId,
        layout: {
          w: component.w,
          h: component.h,
          x: currentPosition.x,
          y: currentPosition.y,
          i: componentId,
        } as Layout,
        name: component.key,
        path: `/${component.key}`,
      });

      page.componentList = comList;

      setPageList((prev) => prev.map((i) => (i.key === page.key ? page : i)));
      dbIns.addItem(DB_STORE.LAYOUT, page);
    }
  };

  console.log("curr", pageList);

  return (
    <Modal open={visible} title="组件列表" onOk={toggle} onCancel={toggle}>
      <div className={tw`flex`}>
        {componentConfig.map((component) => (
          <div
            key={component.key}
            className={tw`px-2 py-1 border-b-1 border-[#fff] hover:cursor-pointer hover:text-frc-500 hover:border-b-1 hover:border-frc-500`}
            onClick={() => {
              addComponet2Page(component);
            }}
          >
            {component.icon || <AppstoreOutlined />}
            {component.title}
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default ComponentListModal;
