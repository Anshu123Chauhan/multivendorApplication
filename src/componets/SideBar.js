import * as React from "react";
import { BsLaptop, BsPhone, BsFilter } from "react-icons/bs";
import { GiClothes, GiHomeGarage } from "react-icons/gi";
import { AiOutlineCar, AiOutlineLogin } from "react-icons/ai";
import { BiLogOutCircle } from "react-icons/bi";
import { signOut } from "firebase/auth";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { selectUserName, setLogOut } from "../feautres/userSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { auth } from "../firebase/firebaseConfig";

const SideBar = ({ filterP, setAllCategory }) => {
  const userName = useSelector(selectUserName);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logOut = () => {
    signOut(auth)
      .then(() => {
        dispatch(setLogOut());
      })
      .catch((err) => alert(err.message));
  };
  return (
    <div className="flex justify-start font-['Cairo']">
      <aside className="h-full w-full bg-white ">
        <div className="pr-3 pl-6 pt-3 overflow-y-auto">
          <ul className="space-y-0 p-0">
            {/* All Products */}
            <li>
              <button
                onClick={setAllCategory}
                className="flex items-center w-full py-2 text-sm font-medium text-[#423C39] hover:text-amber-800 transition"
              >
                <BsFilter size={18} />
                <span className="ml-2">{t("All Products")}</span>
              </button>
              <hr className="border-gray-200 m-1.5" />
            </li>

            {/* Laptops */}
            <li>
              <button
                onClick={() => filterP("laptop")}
                className="flex items-center w-full py-2 text-sm font-medium text-[#423C39] hover:text-amber-800 transition"
              >
                <BsLaptop size={16} />
                <span className="ml-2">{t("Laptops")}</span>
              </button>
              <hr className="border-gray-200 m-1.5" />
            </li>

            {/* Clothes */}
            <li>
              <button
                onClick={() => filterP("Clothes")}
                className="flex items-center w-full py-2 text-sm font-medium text-[#423C39] hover:text-amber-800 transition"
              >
                <GiClothes size={18} />
                <span className="ml-2">{t("Clothes")}</span>
              </button>
              <hr className="border-gray-200 m-1.5" />
            </li>

            {/* Phones */}
            <li>
              <button
                onClick={() => filterP("Phones")}
                className="flex items-center w-full py-2 text-sm font-medium text-[#423C39] hover:text-amber-800 transition"
              >
                <BsPhone size={16} />
                <span className="ml-2">{t("Phones & Tablets")}</span>
              </button>
              <hr className="border-gray-200 m-1.5" />
            </li>

            {/* Accessories */}
            <li>
              <button
                onClick={() => filterP("Accessories")}
                className="flex items-center w-full py-2 text-sm font-medium text-[#423C39] hover:text-amber-800 transition"
              >
                <AiOutlineCar size={18} />
                <span className="ml-2">{t("Accessoires")}</span>
              </button>
              <hr className="border-gray-200 m-1.5" />
            </li>

            {/* Home */}
            <li>
              <button
                onClick={() => filterP("kitchen")}
                className="flex items-center w-full py-2 text-sm font-medium text-[#423C39] hover:text-amber-800 transition"
              >
                <GiHomeGarage size={18} />
                <span className="ml-2">{t("Home")}</span>
              </button>
              <hr className="border-gray-200 m-1.5" />
            </li>

            {/* Login / Logout */}
            <li>
              {userName ? (
                <button
                  onClick={logOut}
                  className="flex items-center w-full py-2 text-sm font-medium text-[#423C39] hover:text-amber-800 transition"
                >
                  <BiLogOutCircle size={18} />
                  <span className="ml-2">{t("SignOut")}</span>
                </button>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="flex items-center w-full py-2 text-sm font-medium text-[#423C39] hover:text-amber-800 transition"
                >
                  <AiOutlineLogin size={18} />
                  <span className="ml-2">{t("login")}</span>
                </button>
              )}
              <hr className="border-gray-200 m-1.5" />
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );


};

export default SideBar;
