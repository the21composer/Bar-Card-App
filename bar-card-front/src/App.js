import React, {Component, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';
import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles';
import MainContainer from "./MainContainer";


const App = () => {
    const [theme] = useState({
        palette:{
            primary:{
                main:"#5173cb"
            },
            secondary:{
                main:"#cb5f5f"
            }
        }
    });

    const muiTheme = createMuiTheme(theme);
    return (
        <ThemeProvider theme={muiTheme}>
            <MainContainer/>
        </ThemeProvider>
    );
}

export default App;
