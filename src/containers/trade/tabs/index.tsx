import { Input, Tabs } from "antd";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { tw } from "twind";
import { css } from "twind/css";
import { DB_STORE } from "src/const/enum";
import {
  LayoutItemProps,
  dbInstance,
  useComponentListModalVisible,
  useCurrentPageKey,
  useLock,
  usePageList,
} from "src/models/store";
import { v6 as uuid } from "uuid";

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

const DoTabs = () => {
  const [dbIns] = useAtom(dbInstance);
  const { pageList, setPageList } = usePageList();
  const { currentPageKey, setCurrentPageKey } = useCurrentPageKey();
  const { toggle: openModal } = useComponentListModalVisible();

  const { toggle, isLock } = useLock();

  const [renameFocus, setRenameFocus] = useState<string>("");

  useEffect(() => {
    // 设置默认currentKey
    if (pageList.length && !currentPageKey) {
      setCurrentPageKey(pageList[0].key);
    }
  }, [pageList, currentPageKey]);

  const handleOperate = (
    mode: "update" | "add" | "delete",
    data: LayoutItemProps | string
  ) => {
    if (["add", "update"].includes(mode)) {
      dbIns.addItem(DB_STORE.LAYOUT, data);
    } else {
      dbIns.deleteData(DB_STORE.LAYOUT, data);
    }
  };

  const onChange = (newActiveKey: string) => {
    setCurrentPageKey(newActiveKey);
  };

  const add = () => {
    const key = uuid();
    const componentKey = uuid();
    const newPanes = [...pageList];

    const obj: LayoutItemProps = {
      label: "New Tab",
      key,
      id: key,
      componentList: [
        {
          name: "market-data",
          path: "/market-data",
          componentId: componentKey,
          layout: { i: componentKey, x: 0, y: 0, w: 5, h: 10, minW: 5 },
        },
      ],
    };
    newPanes.push(obj);
    setPageList(newPanes);

    setCurrentPageKey(key);

    handleOperate("add", obj);
  };

  const remove = (targetKey: TargetKey) => {
    let newActiveKey = currentPageKey;
    let lastIndex = -1;
    pageList.forEach((item, i) => {
      if (item.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = pageList.filter((item) => item.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }
    setPageList(newPanes);
    setCurrentPageKey(newActiveKey);

    handleOperate("delete", targetKey as string);
  };

  const onEdit = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: "add" | "remove"
  ) => {
    if (action === "add") {
      add();
    } else {
      remove(targetKey);
    }
  };

  // 修改标题
  const handleModifyTitleName = (key: string, value: string) => {
    const obj = pageList.find((i) => i.key === key);

    if (obj) {
      const updateInfo = {
        ...obj,
        label: value,
      };
      handleOperate("update", updateInfo);

      setPageList((prev) => prev.map((i) => (i.key === key ? updateInfo : i)));
      setRenameFocus("");
    }
  };

  //---------------------------render------------------------
  const getTitle = (p: LayoutItemProps) => {
    if (p.key === renameFocus && renameFocus === currentPageKey) {
      return (
        <div className={tw`overflow-hidden w-[100px]`}>
          <Input
            size="small"
            onPressEnter={(e) => {
              handleModifyTitleName(p.key, (e.target as any).value);
            }}
          />
        </div>
      );
    } else {
      return (
        <span
          onDoubleClick={() => {
            setRenameFocus(p.key);
          }}
        >
          {p.label}
        </span>
      );
    }
  };

  return (
    <div className={tw`flex justify-between items-center bg-frc-800`}>
      <Tabs
        type="editable-card"
        onChange={onChange}
        activeKey={currentPageKey}
        onEdit={onEdit}
        className={tw`
          ${css`
            .ant-tabs-nav {
              border-bottom: 1px solid currentColor;
              .ant-tabs-tab {
                color: #ffebc8;
                .ant-tabs-tab-remove {
                  color: #ffebc8;
                }
              }
              .ant-tabs-tab-active {
                .ant-tabs-tab-remove {
                  color: #35393b;
                }
              }
            }
          `}
        `}
        items={pageList.map((i) => ({
          label: getTitle(i),
          key: i.key,
          closable: pageList.length > 1,
        }))}
      />
      {/* {(pageList || []).map((i) => (
          <Tabs.TabPane
            key={i.key}
            tabKey={i.key}
            tab={getTitle(i)}
            closable={pageList.length > 1}
          ></Tabs.TabPane>
        ))} */}

      <div className={tw`text-[12px]`}>
        {!isLock && (
          <span className={tw`mx-2 cursor-pointer`} onClick={openModal}>
            新增组件
          </span>
        )}
        <span className={tw`cursor-pointer mr-2`} onClick={toggle}>
          {isLock ? "🔒" : "🔓"}
        </span>
      </div>
    </div>
  );
};

export default DoTabs;
