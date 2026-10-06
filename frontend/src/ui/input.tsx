// ui/input: a single-line field, including the date and time pickers. Pass {...register('name')}
// from React Hook Form.
import { FormField, type FieldProps, type FieldType } from './form-field';

export interface InputProps extends FieldProps {
  type?: FieldType;
}

export function Input(props: InputProps) {
  return <FormField {...props} />;
}
