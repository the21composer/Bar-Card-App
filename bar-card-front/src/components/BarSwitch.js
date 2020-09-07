import React from "react";
import '../App.css';
import {Switch} from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";

export default function BarSwitch() {
    return (
        <FormControlLabel
            control={
                <Switch
                    name="noBar"
                    id="noBar"
                    color="primary"
                />
            }
            label="Только в баре"
        />
    )
}