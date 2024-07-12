import { AppstoreOutlined } from "@ant-design/icons";
import { PropsWithChildren } from "react";
import MarketData from "src/containers/trade/market-data";

export type Compoent = {
  title: string;
};

export type componentItem = {
  key: string;
  title: string;
  w: number;
  h: number;
  icon: JSX.Element;
  component: (props: PropsWithChildren<Compoent>) => JSX.Element;
};

const componentConfig: componentItem[] = [
  {
    key: "market-data",
    title: "行情综合",
    w: 12,
    h: 6,
    icon: <AppstoreOutlined />,
    component: MarketData,
  },
];

export { componentConfig };
