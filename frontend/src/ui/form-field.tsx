// ui/form-field: the form frame and the field every control (Input, Textarea, Select) is built on.
// Fields take what React Hook Form's register() returns ({...register('title')}) plus a label and
// the error message, so features never touch MUI or wire errors by hand.
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import type { ChangeEventHandler, FocusEventHandler, FormEventHandler, ReactNode, Ref } from 'react';

/** `date` and `time` use the browser's own pickers and exchange "YYYY-MM-DD" / "HH:mm". */
export type FieldType = 'text' | 'email' | 'number' | 'password' | 'search' | 'date' | 'time';

export interface FieldProps {
  label: string;
  name: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
  onBlur?: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
  ref?: Ref<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
}

interface FormFieldProps extends FieldProps {
  type?: FieldType;
  multiline?: boolean;
  minRows?: number;
  children?: ReactNode;
}

/** The shared field. Use Input, Textarea or Select; this is their common base. */
export function FormField({
  label,
  name,
  error,
  helperText,
  required,
  disabled,
  onChange,
  onBlur,
  ref,
  type = 'text',
  multiline,
  minRows,
  children,
}: FormFieldProps) {
  const select = children !== undefined;
  // A date or time field always shows its format, so its label must not sit on top of it.
  const shrinkLabel = select || type === 'date' || type === 'time';
  return (
    <TextField
      id={name}
      label={label}
      name={name}
      type={select || multiline ? undefined : type}
      error={Boolean(error)}
      helperText={error ?? helperText}
      required={required}
      disabled={disabled}
      onChange={onChange}
      onBlur={onBlur}
      inputRef={ref}
      multiline={multiline}
      minRows={minRows}
      select={select}
      slotProps={{
        ...(select && { select: { native: true } }),
        ...(shrinkLabel && { inputLabel: { shrink: true } }),
      }}
      fullWidth
    >
      {children}
    </TextField>
  );
}

export interface FormProps {
  onSubmit: FormEventHandler<HTMLFormElement>;
  children: ReactNode;
  /** A form-level error, e.g. from the server, shown above the actions. */
  error?: string;
  actions: ReactNode;
  label: string;
}

/** The one form frame: fields stacked, an optional form-level error, actions at the end. */
export function Form({ onSubmit, children, error, actions, label }: FormProps) {
  return (
    <Box component="form" onSubmit={onSubmit} noValidate aria-label={label} sx={{ maxWidth: 640 }}>
      <Stack spacing={6}>
        {children}
        {error && (
          <Alert severity="error" variant="outlined">
            {error}
          </Alert>
        )}
        <Stack direction="row" spacing={2}>
          {actions}
        </Stack>
      </Stack>
    </Box>
  );
}
