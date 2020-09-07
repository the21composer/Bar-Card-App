import React, {Component} from "react";
import '../App.css';
import MaterialTable from "material-table";
import {localization, tableIcons} from "./TableAddons"
import {Container} from "react-bootstrap";

export default class UserTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            table:{},
            isLoading:true
        }
        this.updateHistory = this.updateHistory.bind(this)
    }

    updateHistory() {
        this.setState({isLoading:true})
        fetch(`/db/history`, {
            method:'POST',
            headers:{
                'Content-Type':'application/json;charset=utf-8'
            },
            body:JSON.stringify({
                id:this.props.id
            })
        })
            .then(data => data.json())
            .then(data => {
                console.log(data)
                this.setState({isLoading:false})
                if (data.success) {
                    this.setState({table:{columns:data.table.columns, data:data.table.data}})
                } else {

                }
            })
    }

    componentDidMount() {
        this.updateHistory()
    }

    render() {
        return (
            <Container className="col-12 p-3">
                <MaterialTable
                    style={{
                        boxShadow:"0px 0px 0px",
                        animation:'appear .3s'
                    }}
                    isLoading={this.props.isLoading}
                    icons={tableIcons}
                    localization={localization}
                    title={
                        <div className="header mr-3 p-2 pl-3 pr-3">
                            История операций:
                        </div>
                    }
                    columns={[
                        {title:'Дата', field:'datetime'},
                        {title:'Описание', field:'description'},
                        {title:'Значение', field:'value'},
                        {title:'Комментарий', field:'comment'},
                        {title:'Пользователь', field:'user'},
                        {title:'Логин', field:'login'}
                    ]}
                    data={this.state.table.data}
                    options={{
                        pageSize:5,
                        pageSizeOptions:[5, 10, 30, 50],
                        searchFieldAlignment:"left",
                        actionsColumnIndex:-1,
                        exportButton:true
                    }}
                />
            </Container>
        )
    }
}