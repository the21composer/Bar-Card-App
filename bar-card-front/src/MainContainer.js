import React, {Component} from 'react';
import SignIn from "./components/SignIn";
import {Container} from "react-bootstrap";
import UserTableContainer from "./components/TableContainer";
import LinearProgress from "@material-ui/core/LinearProgress";

export default class MainContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            auth:false,
            loaded:false,
            admin:false,
            user:{
                name:"",
                surname:"",
                email:""
            }
        }
        this.updateAuth = this.updateAuth.bind(this)
    }

    updateAuth() {
        fetch('/auth', {
            method:'GET',
            headers:{
                'Content-Type':'application/json;charset=utf-8'
            },
        })
            .then(data => data.json())
            .then(data => {
                console.log(data)
                this.setState({
                    auth:data.auth,
                    admin:data.admin,
                    loaded:true,
                    user:{
                        name:data.name,
                        surname:data.surname,
                        email:data.email
                    }
                })
            })
    }

    componentDidMount() {
        this.updateAuth()
    }

    render() {
        return (
            <>
                {this.state.loaded ?
                    <>
                        {
                            this.state.auth ?
                                <Container className="App col-12 p-3">
                                    <UserTableContainer admin={this.state.admin} updateAuth={this.updateAuth}
                                                        user={this.state.user}/>
                                </Container>
                                :
                                <SignIn updateAuth={this.updateAuth}/>
                        }
                    </>
                    :
                    <div className={"col-12 pt-1"}>
                        <LinearProgress/>
                    </div>

                }
            </>
        )
    }
}