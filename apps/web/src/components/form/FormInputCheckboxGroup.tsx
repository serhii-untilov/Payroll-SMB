import React, { useEffect, useState } from 'react';
import { Checkbox, FormControl, FormControlLabel, FormLabel } from '@mui/material';
import { Controller } from 'react-hook-form';

/**
 * {
 *     label: 'Checkbox Option 1',
 *     value: '1',
 * },
 */
export type CheckboxOption = {
    label: string;
    value: number | string;
};

export interface FormInputCheckboxGroupProps {
    name: string;
    control: any;
    label: string;
    options: CheckboxOption[];
    setValue?: any;
}

export const FormInputCheckboxGroup: React.FC<FormInputCheckboxGroupProps> = ({
    name,
    control,
    label,
    options,
    setValue,
}) => {
    const [selectedItems, setSelectedItems] = useState<any>([]);
    // we are handling the selection manually here
    const handleSelect = (value: any) => {
        const isPresent = selectedItems.indexOf(value);
        if (isPresent !== -1) {
            const remaining = selectedItems.filter((item: any) => item !== value);
            setSelectedItems(remaining);
        } else {
            setSelectedItems((prevItems: any) => [...prevItems, value]);
        }
    };
    // we are setting form value manually here
    useEffect(() => {
        setValue(name, selectedItems);
    }, [name, selectedItems, setValue]);
    return (
        <FormControl size={'small'} variant={'outlined'}>
            <FormLabel component="legend">{label}</FormLabel>
            <div>
                {options.map((option: any) => {
                    return (
                        <FormControlLabel
                            control={
                                <Controller
                                    name={name}
                                    render={({ field }) => {
                                        return (
                                            <Checkbox
                                                checked={selectedItems.includes(option.value)}
                                                onChange={() => handleSelect(option.value)}
                                            />
                                        );
                                    }}
                                    control={control}
                                />
                            }
                            label={option.label}
                            key={option.value}
                        />
                    );
                })}
            </div>
        </FormControl>
    );
};
