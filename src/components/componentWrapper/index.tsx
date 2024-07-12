import { ExportOutlined } from "@ant-design/icons";
import { PropsWithChildren } from "react";
import { Compoent } from "src/const/componentConfig";
import { tw } from "twind";

import { WebviewWindow } from "@tauri-apps/api/window";

const ComWrapper = (props: PropsWithChildren<Compoent>) => {
  const openNewWindow = () => {
    const newWindow = new WebviewWindow("new_window", {
      url: "http://localhost:1420/#/trade",
      title: "New Window",
      width: 800,
      height: 600,
    });

    // 可选：监听新窗口的事件
    newWindow.once("tauri://created", function () {
      console.log("New window created");
    });

    newWindow.once("tauri://error", function (e) {
      console.error("Failed to create new window", e);
    });
  };
  return (
    <div className={tw`flex flex-col h-full border-1 border-frc-800`}>
      <div
        className={tw`h-[32px] w-full bg-gray flex justify-between items-center border-b-1 bg-frc-800 px-2 text-[12px]`}
      >
        {props.title || "title"}
        <ExportOutlined
          className={tw`cursor-pointer`}
          onClick={openNewWindow}
        />
      </div>
      <div className={tw`flex-1 p-1`}>{props.children}</div>
    </div>
  );
};

export default ComWrapper;
