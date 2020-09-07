import React, {Component} from "react";
import '../App.css';
import MaterialTable from "material-table";
import {localization, tableIcons} from "./TableAddons"
import TableOptions from "./TableOptions";
import TableHistory from "./TableHistory";
import HistoryIcon from '@material-ui/icons/History';
import {Image} from "react-bootstrap";
import BarSwitch from "./BarSwitch";

export default class UserTable extends Component {
    // eslint-disable-next-line no-useless-constructor
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                {
                    this.props.admin ?
                        <MaterialTable
                            style={{
                                borderRadius:20,
                                boxShadow:"0px 3px 5px rgb(224, 224, 224)",
                                animation:'appear .6s'
                            }}
                            isLoading={this.props.isLoading}
                            icons={tableIcons}
                            localization={localization}
                            title={
                                <div className="mr-3 p-2 pl-3 pr-3">
                                    <Image src="static/logo.png" height="45"/>
                                </div>
                            }
                            columns={[
                                {title:'Имя', field:'name'},
                                {title:'Фамилия', field:'surname'},
                                {title:'Контакты', field:'phone_number'},
                                {title:'Номер карты', field:'card_number'},
                                {
                                    title:'Баланс', field:'balance', type:'numeric', render:rowData =>
                                        (<div style={{fontWeight:"bold"}}>  {rowData['balance']}  </div>)
                                },
                                {
                                    title:'Статус', field:'status', initialEditValue:'В баре', render:rowData =>
                                        (<div style={{minWidth:"150px"}}>  {rowData['status']}  </div>)
                                },
                                {
                                    title:'Примечание', field:'note', render:rowData =>
                                        (<div style={{minWidth:"280px"}}>  {rowData['note']}  </div>)
                                }
                            ]}
                            data={this.props.data}
                            detailPanel={[
                                {
                                    tooltip:'Опции',
                                    render:rowData => {
                                        return (
                                            <TableOptions
                                                rowData={rowData}
                                                updateTable={this.props.updateTable}
                                            />
                                        )
                                    },
                                },
                                {
                                    icon:HistoryIcon,
                                    tooltip:'История',
                                    render:rowData => {
                                        return (
                                            <TableHistory
                                                id={rowData.id}
                                            />
                                        )
                                    },
                                },
                            ]}
                            editable={{
                                onRowAdd:(newData) =>
                                    new Promise((resolve) => {
                                        resolve();
                                        this.props.editTable("ADD_RECORD", newData)
                                    }),
                                onRowUpdate:(newData, prevData) =>
                                    new Promise((resolve) => {
                                        resolve();
                                        this.props.editTable("EDIT_RECORD", newData)
                                    }),
                                onRowDelete:(newData) =>
                                    new Promise((resolve) => {
                                        resolve();
                                        this.props.editTable("DELETE_RECORD", newData)
                                    }),
                            }}
                            options={{
                                pageSize:10,
                                pageSizeOptions:[10, 20, 30, 50, 100],
                                searchFieldAlignment:"left",
                                actionsColumnIndex:-1,
                                exportButton:true,
                                searchFieldVariant:"outlined",
                            }}
                            actions={[
                                {
                                    icon:BarSwitch,
                                    tooltip:'Только в баре',
                                    isFreeAction:true,
                                    onClick:this.props.updateTable
                                }
                            ]}
                        />
                        :
                        <MaterialTable
                            style={{
                                borderRadius:20,
                                boxShadow:"0px 3px 5px rgb(224, 224, 224)",
                                animation:'appear .6s'
                            }}
                            isLoading={this.props.isLoading}
                            icons={tableIcons}
                            localization={localization}
                            title={
                                <div className="mr-3 p-2 pl-3 pr-3">
                                    <Image src="static/logo.png" height="45"/>
                                </div>
                            }
                            columns={[
                                {title:'Имя', field:'name'},
                                {title:'Фамилия', field:'surname'},
                                {title:'Контакты', field:'phone_number'},
                                {title:'Номер карты', field:'card_number'},
                                {
                                    title:'Баланс', field:'balance', type:'numeric', render:rowData =>
                                        (<div style={{fontWeight:"bold"}}>  {rowData['balance']}  </div>)
                                },
                                {
                                    title:'Статус', field:'status', initialEditValue:'В баре', render:rowData =>
                                        (<div style={{minWidth:"150px"}}>  {rowData['status']}  </div>)
                                },
                                {
                                    title:'Примечание', field:'note', render:rowData =>
                                        (<div style={{minWidth:"280px"}}>  {rowData['note']}  </div>)
                                }
                            ]}
                            data={this.props.data}
                            detailPanel={[
                                {
                                    tooltip:'Опции',
                                    render:rowData => {
                                        return (
                                            <TableOptions
                                                rowData={rowData}
                                                updateTable={this.props.updateTable}
                                            />
                                        )
                                    },
                                },
                                {
                                    icon:HistoryIcon,
                                    tooltip:'История',
                                    render:rowData => {
                                        return (
                                            <TableHistory
                                                id={rowData.id}
                                            />
                                        )
                                    },
                                },
                            ]}
                            editable={{
                                onRowAdd:(newData) =>
                                    new Promise((resolve) => {
                                        resolve();
                                        this.props.editTable("ADD_RECORD", newData)
                                    }),
                            }}
                            options={{
                                pageSize:10,
                                pageSizeOptions:[10, 20, 30, 50, 100],
                                searchFieldAlignment:"left",
                                actionsColumnIndex:-1,
                                exportButton:true,
                                searchFieldVariant:"outlined",
                            }}
                            actions={[
                                {
                                    icon:BarSwitch,
                                    tooltip:'Только в баре',
                                    isFreeAction:true,
                                    onClick:this.props.updateTable
                                }
                            ]}
                        />
                }
            </>
        );
    }
}