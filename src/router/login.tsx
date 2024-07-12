import Loadable from "react-loadable";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

export default Loadable({
  loader: () => import("src/containers/login"),
  loading: (<Spin indicator={<LoadingOutlined spin />} />) as any,
});
