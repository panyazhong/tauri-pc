import { Button, Checkbox, Form, Image, Input, message } from "antd";
import { tw } from "twind";
import { css } from "twind/css";
import { useNavigate } from "react-router-dom";

import Logo from "src/assets/react.svg";
import { useAtom } from "jotai";
import { dbInstance } from "src/models/store";
import { useRef, useState } from "react";
import { useAsyncEffect } from "ahooks";
import { DB_STORE } from "src/const/enum";

const { Item } = Form;

const Login = () => {
  const [dbIns] = useAtom(dbInstance);
  // 缓存当前记录信息
  const cacheInfo = useRef({});
  const [form] = Form.useForm();
  const [isRem, setIsRem] = useState<boolean>(false);
  const navigate = useNavigate();

  const submit = async () => {
    try {
      const valids = await form.validateFields();
      dbIns.addItem(DB_STORE.USER_CONFIG, {
        ...cacheInfo.current,
        key: "user_info",
        info: { ...valids, isRemember: isRem },
      });
      if (valids.account === "admin" && valids.password === "123456") {
        message.success("login success");
        navigate("/trade");
      } else {
        message.error("login error");
      }
    } catch (error) {
      console.log(error);
    }
  };
  useAsyncEffect(async () => {
    if (dbIns) {
      const res = await dbIns.getItem(DB_STORE.USER_CONFIG, "key", "user_info");
      console.log(res);
      if (res) {
        cacheInfo.current = res;
        form.setFieldsValue(res.info);
        setIsRem(res.info.isRemember);
      }
    }
  }, [dbIns]);
  return (
    <div className={tw`flex flex-row h-full`}>
      <div
        className={tw`w-[50%] text-[#000] flex justify-center items-center
          ${css`
            img {
              width: 100px !important;
              height: 100px;
            }
          `}
        `}
      >
        <Image src={Logo} />
      </div>
      <div
        className={tw`flex-1 w-full h-full flex flex-col justify-center items-center border-l-[1px]`}
      >
        <div className={tw`text-[#000] mb-8 text-[20px]`}>账号登陆</div>
        <Form
          form={form}
          validateTrigger="onBlur"
          className={tw`w-[300px] 
            ${css`
              input,
              button {
                box-shadow: none;
              }
            `}  
          `}
        >
          <Item
            label="账号"
            name="account"
            rules={[
              {
                required: true,
                message: "请填写账号",
              },
            ]}
          >
            <Input placeholder="请输入帐号" />
          </Item>
          <Item
            label="密码"
            name="password"
            rules={[
              {
                required: true,
                message: "请填写密码",
              },
            ]}
          >
            <Input.Password></Input.Password>
          </Item>
          <Button className={tw`w-full`} onClick={submit}>
            登陆
          </Button>

          <div className={tw`flex justify-between mt-2`}>
            <Checkbox
              checked={isRem}
              onChange={(e) => {
                setIsRem(e.target.checked);
              }}
            >
              记住密码
            </Checkbox>

            <div
              className={tw`hover:cursor-pointer hover:underline hover:text-[#4096ff]`}
            >
              忘记密码？
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
