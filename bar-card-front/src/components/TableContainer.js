import React, {Component} from "react";
import '../App.css';
import UserTable from './Table'
import OptionContainer from "./OptionContainer";
import TableAdmin from "./TableAdmin";

export default class UserTableContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            table:{},
            isLoading:true,
            users:{},
            uisLoading:true,
            uShow: false,
        }
        this.editTable = this.editTable.bind(this)
        this.editUsers = this.editUsers.bind(this)
        this.updateTable = this.updateTable.bind(this)
        this.updateUsers = this.updateUsers.bind(this)
    }

    updateTable() {
        this.setState({isLoading:true})
        const contentSwitch = document.getElementById("noBar").checked
        fetch(`/db/get`, {
            method: 'POST',
            headers:{
                'Content-Type':'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                content: contentSwitch
            })
        })
            .then(data => data.json())
            .then(data => {
                console.log(data)
                this.setState({isLoading:false})
                if (data.success) {
                    this.setState({table:{columns:data.table.columns, data:data.table.data}})
                } else {
                    alert(data.error)
                }
            })
    }

    updateUsers() {
        this.setState({
            uisLoading:true,
            uShow:true
        })
        fetch(`/users/get`, {
            method: 'POST',
            headers:{
                'Content-Type':'application/json;charset=utf-8'
            },
        })
            .then(data => data.json())
            .then(data => {
                console.log(data)
                if (data.success) {
                    this.setState({users:{columns:data.table.columns, data:data.table.data}})
                } else {
                    alert(data.error)
                }
                this.setState({uisLoading:false})
            })
    }

    componentDidMount() {
        this.updateTable()
    }

    editTable(task, data) {
        this.setState({isLoading:true})
        fetch(`/db/edit`, {
            method:"POST",
            headers:{
                'Content-Type':'application/json;charset=utf-8'
            },
            body:JSON.stringify({
                task,
                data
            })
        })
            .then(data => data.json())
            .then(data => {
                console.log(data)
                this.setState({isLoading:false})
                this.updateTable()
            })
    }

    editUsers(task, data) {
        this.setState({uisLoading:true})
        fetch(`/users/edit`, {
            method:"POST",
            headers:{
                'Content-Type':'application/json;charset=utf-8'
            },
            body:JSON.stringify({
                task,
                data
            })
        })
            .then(data => data.json())
            .then(data => {
                console.log(data)
                this.setState({uisLoading:false})
                this.updateUsers()
            })
    }


    render() {
        return (
            <>
                <UserTable
                    editTable={this.editTable}
                    isLoading={this.state.isLoading}
                    data={this.state.table.data}
                    updateTable={this.updateTable}
                    admin={this.props.admin}
                />
                <OptionContainer
                    updateTable={this.updateTable}
                    updateAuth={this.props.updateAuth}
                    updateUsers={this.updateUsers}
                    user={this.props.user}
                    admin={this.props.admin}
                />
                {this.state.uShow &&
                <TableAdmin
                    editUsers={this.editUsers}
                    updateUsers={this.updateUsers}
                    data={this.state.users.data}
                    isLoading={this.state.uisLoading}
                />}
            </>
        )
    }
}