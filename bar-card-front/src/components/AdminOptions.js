import React from "react";
import '../App.css';
import {Container, Row, Col} from "react-bootstrap"
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";

export default function AdminOptions(props) {
    const [state, setState] = React.useState({
        status:props.rowData.admin,
    });

    const handleChange = (event) => {
        const name = event.target.name;
        setState({
            ...state,
            [name]:event.target.value,
        });
    };

    const updateStatus = (id) => {
        fetch('/update_admin', {
            method:'POST',
            headers:{
                'Content-Type':'application/json;charset=utf-8'
            },
            body:JSON.stringify({
                status:state.status,
                id:id
            })
        })
            .then(data => data.json())
            .then(data => {
                if (data.success) {
                    props.updateUsers()
                } else {
                    alert(data.error)
                }
            })
    }

    return (
        <Container className="col-12 bg-light">
            <Container className="animate col-12">
                <Row>
                    <Col className="col-auto pt-3 pb-3 pl-1 pr-2">
                        <Container className="bg-white custom-card p-3">
                            <Row>
                                <div className="header ml-3">Права доступа</div>
                            </Row>
                            <Row className="p-2">
                                <Col className="col-auto d-flex align-items-center">
                                    <FormControl variant="outlined" size="small" className="col-12 mt-3">
                                        <InputLabel id="status-label">Статус</InputLabel>
                                        <Select
                                            className="mb-3"
                                            value={state.status}
                                            onChange={handleChange}
                                            labelId="status"
                                            name="status"
                                            id="status"
                                            label="Статус"
                                        >
                                            <MenuItem value={"Да"}>Да</MenuItem>
                                            <MenuItem value={"Нет"}>Нет</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Col>
                                <Col className="col-auto d-flex align-items-center">
                                    <Button variant="contained"
                                            onClick={() => updateStatus(props.rowData.id)}>
                                        Сохранить
                                    </Button>
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                </Row>
            </Container>
        </Container>
    )
}