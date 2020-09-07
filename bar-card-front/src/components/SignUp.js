import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Form, Container, Col} from "react-bootstrap";
import Button from "@material-ui/core/Button";

export default class SignUp extends Component {
    constructor(props) {
        super(props);
        this.handleOnChange = this.handleOnChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.state = {
            values:{
                login:'',
                email:'',
                password1:'',
                password2:'',
                name:'',
                surname:'',
            },
            errors:{
                login:false,
                email:false,
                password1:true,
                password2:true,
                name:false,
                surname:false,
            },
            rules:{
                email:[v => v.search(/^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/g) !== -1 || "Формат почты не верный"],
                login:[
                    v => !!v || "Введите логин.",
                    v => v.length > 5 || "Логин должен быть длиннее 5 символов.",
                    v => v.search(/^[a-zA-Z0-9_-]*$/) !== -1 || "Логин может содержать только символы _ - 0-9 a-z A-Z.",
                    v => v.search(/^[a-zA-Z]/) !== -1 || "Логин может начинаться только на символы a-z A-Z.",
                ],
                password1:[
                    v => !!v || "Введите пароль.",
                    v => v.length > 5 || "Пароль должен быть длиннее 5 символов.",
                    v => v.search(/(?=.*[0-9])/g) !== -1 || "Пароль должен содержать хотя бы одну цифру.",
                    v => v.search(/(?=.*[a-z])/g) !== -1 || "Пароль должен содержать хотя бы одну латинскую букву в нижнем регистре.",
                    v => v.search(/[!@#$%^&*0-9a-zA-Z]/g) !== -1 || "Пароль может содержать только !@#$%^&*0-9a-zA-Z."],
                password2:[
                    v => !!v || "Введите пароль.",
                    v => v === this.password1Input.value || "Пароли не совпадают."],
                name:[
                    v => !!v || "Введите имя.",
                    v => v.search(/^[а-яА-Яa-zA-Z]+$/) !== -1 || "Имя может содержать только символы - а-я А-Я a-z A-Z"],
                surname:[
                    v => v.search(/^[а-яА-Яa-zA-Z]+$/) !== -1 || "Фамилия может содержать только символы - а-я А-Я a-z A-Z",
                    v => !!v || "Введите фамилию."],
            },

        }
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

    handleSubmit() {
        if (Object.values(this.state.errors).every(e => !e)) {
            fetch('/sign/up', {
                method:'POST',
                headers:{
                    'Content-Type':'application/json;charset=utf-8'
                },
                body:JSON.stringify({
                    ...this.state.values,
                })
            })
                .then(data => data.json())
                .then(data => {
                    alert(data.message)
                    this.props.handleReg()
                })
        } else {
            alert("Ошибка в введенных данных")
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


    render() {
        return (
            <Container className="col-12 col-lg-9 p-3 ">
                <Container className="custom-card bg-light p-3">
                    <p className="h5 mb-3 text-center">
                        Регистрация
                    </p>
                    <Col>
                        <Form>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridName" className="col-12 col-lg-6">
                                    <Form.Label>Имя</Form.Label>
                                    <Form.Control
                                        isInvalid={!!this.state.errors.name}
                                        name={"name"}
                                        value={this.state.values.name}
                                        onChange={this.handleOnChange}
                                        type="text"
                                        placeholder="Введите полное имя"
                                        className="custom-textform"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {this.state.errors.name}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridSurname" className="col-12 col-lg-6">
                                    <Form.Label>Фамилия</Form.Label>
                                    <Form.Control
                                        isInvalid={!!this.state.errors.surname}
                                        name={"surname"}
                                        value={this.state.values.surname}
                                        onChange={this.handleOnChange}
                                        type="text"
                                        placeholder="Введите фамилию"
                                        className="custom-textform"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {this.state.errors.surname}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridLogin" className="col-12 col-lg-6">
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

                                <Form.Group as={Col} controlId="formGridEmail" className="col-12 col-lg-6">
                                    <Form.Label>Почта</Form.Label>
                                    <Form.Control
                                        isInvalid={!!this.state.errors.email}
                                        name={"email"}
                                        value={this.state.values.email}
                                        onChange={this.handleOnChange}
                                        type="email"
                                        placeholder="Введите почту"
                                        className="custom-textform"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {this.state.errors.email}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridPassword1" className="col-12 col-lg-6">
                                    <Form.Label>Пароль</Form.Label>
                                    <Form.Control
                                        isInvalid={!!this.state.errors.password1}
                                        name={"password1"}
                                        value={this.state.values.password1}
                                        onChange={this.handleOnChange}
                                        type="password"
                                        placeholder="Введите пароль"
                                        className="custom-textform"
                                        ref={(input) => this.password1Input = input}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {this.state.errors.password1}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridPassword2" className="col-12 col-lg-6">
                                    <Form.Label>Повторить пароль</Form.Label>
                                    <Form.Control
                                        isInvalid={!!this.state.errors.password2}
                                        name={"password2"}
                                        value={this.state.values.password2}
                                        onChange={this.handleOnChange}
                                        type="password"
                                        placeholder="Повторите пароль"
                                        className="custom-textform"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {this.state.errors.password2}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>

                            <Button
                                variant="contained"
                                color="primary"
                                onClick={this.handleSubmit}
                                className="custom-btn mr-3 mb-2"
                            >
                                Зарегистрироваться
                            </Button>
                        </Form>
                    </Col>
                </Container>
            </Container>
        )
    }
}