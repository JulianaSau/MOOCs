import { useRef, useState } from "react";
import useClickOutside from "../../hooks/useClickOutside";
import { GoGlobe } from "react-icons/go";
import { dynamicActivate } from "../../i18n";
import "./style.scss";
import PropTypes from "prop-types";

interface IProps {
  btncolor?: string;
}

/**
 * @category Client
 * @subcategory Component
 * @module Language Toggler
 * @description The component displays and toggles the language selection menu on each pages,
 * @component
 * @example
 *   <LanguageToggle />
 *    or
 *   <LanguageToggle btncolor="#009985" />
 */

const index = ({ btncolor }: IProps) => {
  const [openLanguage, setOpenLanguage] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpenLanguage(false));
  const options = [
    { value: "en", label: "English" },
    { value: "ar", label: "عربي" },
  ];

  const locale = window.localStorage.getItem("language");

  const changeLanguage = (selectedOption: any) => {
    window.localStorage.setItem("language", selectedOption);
    dynamicActivate(selectedOption);
  };
  return (
    <div className="languagetoggler">
      <button
        style={{ color: btncolor ? btncolor : "#000" }}
        onClick={() => setOpenLanguage(!openLanguage)}
        className="languagetoggler__selected"
      >
        {" "}
        <GoGlobe />
        {locale}
      </button>
      {openLanguage && (
        <div ref={ref} className="languagetoggler__btn">
          {options.map((item) => (
            <button
              onClick={() => {
                changeLanguage(item.value);
              }}
              key={item.label}
            >
              {item.label} ({item.value})
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
index.propTypes = {
  btncolor: PropTypes.string,
};
export default index;
