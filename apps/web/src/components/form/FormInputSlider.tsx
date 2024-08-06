import { FormLabel, Slider } from '@mui/material';
import React, { useEffect } from 'react';
import { Controller } from 'react-hook-form';

interface Props {
    name: string;
    control: any;
    label: string;
    setValue?: any;
}

export const FormInputSlider = ({ name, control, setValue, label }: Props) => {
    const [sliderValue, setSliderValue] = React.useState<number>(30);

    useEffect(() => {
        if (sliderValue) setValue(name, sliderValue);
    }, [name, setValue, sliderValue]);

    const handleChange = (_event: any, newValue: number | number[]) => {
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
