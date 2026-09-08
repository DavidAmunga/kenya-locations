import {
  Combobox,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
} from "@/components/ui/combobox";
import { Field, FieldLabel } from "@/components/ui/field";

export type LocationOption = {
  value: string;
  label: string;
};

type LocationComboboxProps = {
  label: string;
  items: LocationOption[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
};

export function LocationCombobox({
  label,
  items,
  value,
  onValueChange,
  placeholder,
  disabled = false,
}: LocationComboboxProps) {
  const selected = items.find((item) => item.value === value) ?? null;

  return (
    <Field className="w-full">
      <FieldLabel>{label}</FieldLabel>
      <Combobox
        disabled={disabled}
        itemToStringLabel={(item: LocationOption) => item.label}
        items={items}
        onValueChange={(item: LocationOption | null) =>
          onValueChange(item?.value ?? "")
        }
        value={selected}
      >
        <ComboboxInput disabled={disabled} placeholder={placeholder} />
        <ComboboxPopup>
          <ComboboxEmpty>No matches.</ComboboxEmpty>
          <ComboboxList>
            {(item: LocationOption) => (
              <ComboboxItem key={item.value} value={item}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxPopup>
      </Combobox>
    </Field>
  );
}
