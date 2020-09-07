import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Form, Container, Col, Image} from "react-bootstrap";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import SignUp from "./SignUp";

export default class SignIn extends Component {
    constructor(props) {
        super(props);
        this.handleVerify = this.handleVerify.bind(this)
        this.handleOnChange = this.handleOnChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleReg = this.handleReg.bind(this)
        this.state = {
            reg:false,
            values:{
                login:'',
                password:'',
            },
            errors:{
                login:false,
                password:false,

            },
            rules:{
                login:[
                    v => !!v || "Введите логин.",
                ],
                password:[
                    v => !!v || "Введите пароль.",
                ],

            }
        }
    }

    handleOnChange(event) {
        const name = event.target.name
        const value = event.target.value
        this.setState(prevState => {
            prevState.values[name] = value
            return prevState
        })
        this.handleVerify(name, value)
    }

    handleSubmit() {
        fetch('/sign/in', {
            method:'POST',
            headers:{
                'Content-Type':'application/json;charset=utf-8'
            },
            body:JSON.stringify(this.state.values)
        })
            .then(data => data.json())
            .then(data => {
                if (data.success) {
                    this.props.updateAuth()
                } else {
                    alert(data.error)
                }
            })
    }

    handleVerify(name, value) {
        this.setState(prevState => {
            const errors = prevState.rules[name].map(e => {
                let err = e(value)
                return err !== true ? err : null
            })
                .filter(function (e) {
                    return e !== null
                })
                .map(e => <p className="p-0 m-0">{e}</p>)
            prevState.errors[name] = errors.length === 0 ? false : errors
            return prevState
        })
    }

    handleReg() {
        this.setState({
            reg: this.state.reg === false
        })
    }

    render() {
        return (
            <>
                <Container className="col-12">
                    <Container className="col-12 col-lg-6 p-3">
                        <Container className="custom-card bg-light p-3">
                            <p className="h5 mb-3 text-center">
                                <Image src="static/logo.png" width="80"/>
                                | Авторизация
                            </p>
                            <Col>
                                <Form>
                                    <Form.Group controlId="formBasicLogin">
                                        <Form.Label>Логин</Form.Label>
                                        <Form.Control
                                            isInvalid={!!this.state.errors.login}
                                            name={"login"}
                                            value={this.state.values.login}
                                            onChange={this.handleOnChange}
                                            type="text"
                                            placeholder="Введите логин"
                                            className="custom-textform"
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {this.state.errors.login}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group controlId="formBasicPassword">
                                        <Form.Label>Пароль</Form.Label>
                                        <Form.Control
                                            isInvalid={!!this.state.errors.password}
                                            name={"password"}
                                            value={this.state.values.password}
                                            onChange={this.handleOnChange}
                                            type="password"
                                            placeholder="Введите пароль"
                                            className="custom-textform"
                                            ref={(input) => this.passwordInput = input}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {this.state.errors.password}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Button color="primary" variant="contained" className="mr-3 mb-2"
                                            onClick={this.handleSubmit}>
                                        Войти
                                    </Button>
                                    <Button variant="contained" className="mr-3 mb-2" onClick={this.handleReg}>
                                        Регистрация
                                    </Button>
                                </Form>
                            </Col>
                        </Container>
                    </Container>
                </Container>
                {this.state.reg &&
                <Container className="col-12">
                    <SignUp handleReg={this.handleReg}/>
                </Container>}

            </>
        );
    }
}