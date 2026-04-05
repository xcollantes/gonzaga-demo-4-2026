/**
 * ThemeSelector Component
 *
 * A dropdown component that allows users to select a theme preference.
 * This component is designed to be used in profile settings.
 */

import { THEME_OPTIONS } from "@/components/DarkModeToggleSwitch";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/Form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { useTheme } from "@/contexts/ThemeContext";
import { Control, FieldPath, FieldValues } from "react-hook-form";

interface ThemeSelectorProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
}

export function ThemeSelector<T extends FieldValues>({ control, name }: ThemeSelectorProps<T>) {
  const { theme, setTheme } = useTheme();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Theme Preference</FormLabel>
          <Select
            onValueChange={(value) => {
              field.onChange(value);
              setTheme(value as typeof THEME_OPTIONS[number]['value']);
            }}
            value={field.value as string || theme || "light"}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select your theme preference" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {THEME_OPTIONS.map((themeOption) => (
                <SelectItem key={themeOption.value} value={themeOption.value}>
                  {themeOption.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
}