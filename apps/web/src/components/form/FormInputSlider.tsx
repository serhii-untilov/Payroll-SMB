import React, { useEffect } from 'react';
import { FormLabel, Slider } from '@mui/material';
import { Controller } from 'react-hook-form';

export interface FormInputSliderProps {
    name: string;
    control: any;
    label: string;
    setValue?: any;
}

export const FormInputSlider = ({ name, control, setValue, label }: FormInputSliderProps) => {
    const [sliderValue, setSliderValue] = React.useState<number>(30);

    useEffect(() => {
        if (sliderValue) setValue(name, sliderValue);
    }, [name, setValue, sliderValue]);

    const handleChange = (event: any, newValue: number | number[]) => {
        setSliderValue(newValue as number);
    };

    return (
        <>
            <FormLabel component="legend">{label}</FormLabel>
            <Controller
                name={name}
                control={control}
                // render={({ field, fieldState, formState }) => (
                render={() => (
                    <Slider
                        value={sliderValue}
                        onChange={handleChange}
                        valueLabelDisplay="auto"
                        min={0}
                        max={100}
                        step={1}
                    />
                )}
            />
        </>
    );
};
