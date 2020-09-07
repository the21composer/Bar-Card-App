import React, {Component} from "react";
import '../App.css';
import MaterialTable from "material-table";
import {localization, tableIcons} from "./TableAddons"
import {Col, Container, Row} from "react-bootstrap";
import TableOptions from "./TableOptions";
import HistoryIcon from "@material-ui/icons/History";
import TableHistory from "./TableHistory";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import AdminOptions from "./AdminOptions";

export default class TableAdmin extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <MaterialTable
                    style={{
                        borderRadius:20,
                        boxShadow:"0px 3px 5px rgb(224, 224, 224)",
                        animation:'appear .6s',
                        marginTop:"15px"
                    }}
                    isLoading={this.props.isLoading}
                    icons={tableIcons}
                    localization={localization}
                    title={
                        <div className="header mr-3 p-2 pl-3 pr-3">
                            Пользователи приложения
                        </div>
                    }
                    columns={[
                        {title:'Имя', field:'name'},
                        {title:'Фамилия', field:'surname'},
                        {title:'Email', field:'email'},
                        {title:'Логин', field:'login'},
                        {title:'Администратор', field:'admin'}
                    ]}
                    editable={{
                        onRowDelete:(newData) =>
                            new Promise((resolve) => {
                                resolve();
                                this.props.editUsers("DELETE_RECORD", newData)
                            }),
                    }}
                    detailPanel={[
                        {
                            tooltip:'Опции',
                            render:rowData => {
                                return (
                                    <AdminOptions
                                        updateUsers={this.props.updateUsers}
                                        rowData={rowData}
                                    />
                                )
                            },
                        },
                    ]}
                    data={this.props.data}
                    options={{
                        pageSize:10,
                        pageSizeOptions:[10, 20, 30],
                        searchFieldAlignment:"left",
                        actionsColumnIndex:-1,
                        exportButton:true
                    }}
                />
            </>
        )
    }
}