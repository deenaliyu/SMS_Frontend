import { HiArrowSmallRight } from "react-icons/hi2";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const AdmissionHeader = ({ page, title }) => {
  return (
    <div className="border-b p-2 px-14 border-[#D7D7D7] w-[100%]">
      <div className="flex items-center gap-2">
        <Link to={`/${page}`}>
          <p className="text-[#101828] text-[16px]">{page}</p>
        </Link>
        <HiArrowSmallRight className="text-[16px] text-[#101828]" />
        <p className="text-[#09B451] text-[16px]">{title}</p>
      </div>
    </div>
  );
};

AdmissionHeader.propTypes = {
  page: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default AdmissionHeader;
