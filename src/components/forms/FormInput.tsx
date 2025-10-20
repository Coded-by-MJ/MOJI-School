import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type FormInputProps = {
  name: string;
  type: string;
  label?: string;
  defaultValue?: string;
  placeholder: string;
  readOnly?: boolean;
  className: string;
};

function FormInput(props: FormInputProps) {
  const { label, className, name, type, defaultValue, placeholder, readOnly } =
    props;
  return (
    <div className={className}>
      <Label htmlFor={name} className="capitalize text-sm">
        {label || name}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        readOnly={readOnly}
        defaultValue={defaultValue}
        disabled={readOnly}
        placeholder={placeholder}
        className="disabled:cursor-not-allowed h-10"
        required
      />
    </div>
  );
}
export default FormInput;
