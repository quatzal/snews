import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';



//@ts-ignore
export default function RadioButtonsGroup({ handleChange }) {
    return (
        <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">Come vuoi usare la tua frase personalizzata?</FormLabel>
            <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="false"
                name="radio-buttons-group"
                onChange={handleChange}
            >
                <FormControlLabel value="true" control={<Radio />} label="Prefisso della news" />
                <FormControlLabel value="false" control={<Radio />} label="Suffisso della news" />
            </RadioGroup>
        </FormControl>
    );
}