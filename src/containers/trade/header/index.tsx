import { useNavigate } from "react-router-dom";
import { tw } from "twind";

const Header = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/login");
  };

  return (
    <div
      className={tw`flex justify-between items-center h-[36px] bg-frc-800 text-frcFont-50 `}
    >
      <div>header</div>

      <div className={tw`flex flex-start pr-2 text-sm`}>
        <span
          className={tw`cursor-pointer text-frcFont-50 hover:text-frc-500`}
          onClick={handleClick}
        >
          退出登陆
        </span>
      </div>
    </div>
  );
};

export default Header;
