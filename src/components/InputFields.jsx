import PropTypes from "prop-types";

const InputFields = ({
  title,
  placeholder,
  inputType = "text",
  name,
  value,
  onChange,
  required = false,
  disabled = false,
}) => {
  return (
    <label className="flex text-[#151716] text-[14px] font-semibold flex-col">
      {title}
      <input
        type={inputType}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className="p-2 border outline-0 border-[#989E99] placeholder:text-[#7B8389] mt-2 rounded-md disabled:bg-gray-100"
      />
    </label>
  );
};

InputFields.propTypes = {
  title: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  inputType: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
};

InputFields.defaultProps = {
  placeholder: "",
  value: "",
  onChange: undefined,
};

export default InputFields;
