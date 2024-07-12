import { useEffect, useState } from "react";
// import { invoke } from "@tauri-apps/api/tauri";
// import { arch, platform, tempdir } from "@tauri-apps/api/os";
import "./App.css";
// import {
//   isPermissionGranted,
//   requestPermission,
// } from "@tauri-apps/api/notification";
// import { checkUpdate, installUpdate } from "@tauri-apps/api/updater";

import { setup, tw } from "twind";
import IndexedDBClass, { Store } from "./database";
import { useAtom } from "jotai";
import { dbInstance } from "./models/store";
import { Spin } from "antd";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { DB_STORE } from "./const/enum";
import {
  checkUpdate,
  installUpdate,
  onUpdaterEvent,
} from "@tauri-apps/api/updater";

setup({
  theme: {
    extend: {
      borderRadius: {
        inherit: "inherit",
      },
      fontSize: {
        sm: "12px",
        normal: "14px",
        lg: "16px",
      },
    },
    colors: {
      frc: {
        500: "#4096ff",
        600: "#E04437",
        750: "#172C30",
        800: "#35393B",
        850: "#232628",
        900: "#191b1c",
        950: "#0A0B0B",
      },
      frcFont: {
        50: "#FFEBC8",
        100: "#FFCC74",
        Wait_Confirm: "#FF7D00",
        Has_Confirm: "#FFEBC8",
        Send_Abolished: "##1FADFF",
        Wait_Confirm_Abolished: "#E04437",
        Completed: "#00B563 ",
        Abolished: "#BEC6C9  ",
      },
      grayFont: {
        DEFAULT: "#BEC6C9",
      },
    },
  },
});

function App(props: any) {
  // const [, setGreetMsg] = useState("");
  // const [name] = useState("");
  const [, setDB] = useAtom(dbInstance);
  const [loading, setLoading] = useState<boolean>(true);

  const DBConnect = async () => {
    setLoading(true);
    const storeNames: Store[] = [
      {
        storeName: DB_STORE.USER_CONFIG,
        config: [
          {
            name: "key",
            configInfo: {
              unique: true,
            },
          },
        ],
      },
      {
        storeName: DB_STORE.LAYOUT,
        config: [
          {
            name: "id",
            configInfo: {
              unique: true,
            },
          },
        ],
      },
    ];
    const indexedDB = new IndexedDBClass("tauri", storeNames);
    setDB(indexedDB);
    await indexedDB.connect();

    setLoading(false);

    // console.log(await indexedDB.getStore("user_config"));
  };

  const checkForUpdate = async () => {
    try {
      const { shouldUpdate } = await checkUpdate();

      if (shouldUpdate) {
        const userConsent = confirm(
          "A new update is available. Do you want to install it?"
        );
        if (userConsent) {
          // 安装更新
          await installUpdate();
        }
      }
    } catch (error) {
      console.error("Failed to check for updates", error);
    }
  };

  // 监听更新事件
  onUpdaterEvent(({ error, status }) => {
    if (error) {
      console.error("Updater error:", error);
    } else {
      console.log("Updater status:", status);
    }
  });

  useEffect(() => {
    checkForUpdate();
    // window.indexedDB.deleteDatabase("tauri");
    DBConnect();
  }, []);

  // async function greet() {
  //   // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
  //   setGreetMsg(await invoke("greet", { name }));
  // }

  // const getArchInfo = async () => {
  //   const archInfo = await arch();
  //   const platformInfo = await platform();
  //   const tempdirInfo = await tempdir();
  //   console.log(archInfo, platformInfo, tempdirInfo);

  //   let permissionGranted = await isPermissionGranted();
  //   console.log("permission", permissionGranted);
  //   if (!permissionGranted) {
  //     const permission = await requestPermission();
  //     permissionGranted = permission === "granted";
  //   }

  //   // if (permissionGranted) {
  //   //   sendNotification("Tauri is awesome!");
  //   //   sendNotification({ title: "TAURI", body: "Tauri is awesome!" });
  //   // }

  //   const update = await checkUpdate();
  //   console.log("---update", update);
  //   if (update.shouldUpdate) {
  //     console.log(
  //       `Installing update ${update.manifest?.version}, ${update.manifest?.date}, ${update.manifest?.body}`
  //     );
  //     await installUpdate();
  //   }
  // };

  // const doCommand = async () => {
  //   invoke("execute_command", { command: "ls -a" }).then((res) => {
  //     console.log(res);
  //   });
  // };

  return (
    <>
      {loading ? (
        <Spin />
      ) : (
        <div className={tw`w-full h-full bg-frc-900 text-frcFont-50`}>
          {props.children}
        </div>
      )}
    </>
  );
}

export default App;
