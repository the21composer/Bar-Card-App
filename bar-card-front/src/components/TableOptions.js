import React from "react";
import '../App.css';
import {Container, Row, Col} from "react-bootstrap"
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

export default function TableOptions(props) {
    const [state, setState] = React.useState({
        status:props.rowData.status,
        value:0,
        comment:"",
        comment_status:"",
        note:"",
        checkedReturn:false
    });

    const handleCheck = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });
    }

    const handleChange = (event) => {
        const name = event.target.name;
        setState({
            ...state,
            [name]:event.target.value,
        });
    };

    const cardAction = (event, id) => {
        fetch('/card_action', {
            method:'POST',
            headers:{
                'Content-Type':'application/json;charset=utf-8'
            },
            body:JSON.stringify({
                event:event,
                amount:state.value,
                comment:state.comment,
                return:state.checkedReturn,
                id:id
            })
        })
            .then(data => data.json())
            .then(data => {
                if (data.success) {
                    props.updateTable()
                } else {
                    alert(data.error)
                }
            })
    }

    const updateStatus = (id) => {
        fetch('/update_status', {
            method:'POST',
            headers:{
                'Content-Type':'application/json;charset=utf-8'
            },
            body:JSON.stringify({
                status:state.status,
                comment:state.comment_status,
                id:id
            })
        })
            .then(data => data.json())
            .then(data => {
                if (data.success) {
                    props.updateTable()
                } else {
                    alert(data.error)
                }
            })
    }

    const updateNote = (id) => {
        fetch('/update_note', {
            method:'POST',
            headers:{
                'Content-Type':'application/json;charset=utf-8'
            },
            body:JSON.stringify({
                note:state.note,
                id:id
            })
        })
            .then(data => data.json())
            .then(data => {
                if (data.success) {
                    props.updateTable()
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
                                <div className="header ml-3">Изменение баланса:</div>
                            </Row>
                            <Row className="p-2">
                                <Col className="col-auto mr-3">
                                    <Row className="mb-1 pl-3">
                                        <TextField
                                            id="standard-number"
                                            label="Сумма"
                                            type="number"
                                            name="value"
                                            value={state.value}
                                            onChange={handleChange}
                                            InputLabelProps={{
                                                shrink:true,
                                            }}
                                            variant="outlined"
                                            size="small"
                                        />
                                    </Row>
                                    <Row className="pl-3">
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={state.checkedReturn}
                                                    onChange={handleCheck}
                                                    name="checkedReturn"
                                                    color="primary"
                                                />
                                            }
                                            label="Возврат (для зачисления)"
                                        />
                                    </Row>
                                </Col>
                                <Col className="col-auto">
                                    <Row className="mb-2">
                                        <Button variant="contained" color="secondary" name="drop"
                                                className="col-12"
                                                onClick={() => cardAction("drop", props.rowData.id)}>
                                            Снять с карты
                                        </Button>
                                    </Row>
                                    <Row>
                                        <Button variant="contained" color="primary"
                                                className="col-12"
                                                onClick={() => cardAction("add", props.rowData.id)}>
                                            Зачислить
                                        </Button>
                                    </Row>
                                </Col>
                            </Row>
                            <Row className="p-2">
                                <Col className="col-12 d-flex align-items-center">
                                    <TextField
                                        className="col-12"
                                        id="comment"
                                        label="Комментарий"
                                        variant="outlined"
                                        name="comment"
                                        value={state.comment}
                                        onChange={handleChange}
                                        size="small"
                                        multiline={true}
                                    />
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                    <Col className="col-auto pt-3 pb-3 pl-1 pr-2">
                        <Container className="bg-white custom-card p-3">
                            <Row>
                                <div className="header ml-3">Изменение состояния:</div>
                            </Row>
                            <Row className="p-2">
                                <Col className="col-6">
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
                                            <MenuItem value={"В баре"}>В баре</MenuItem>
                                            <MenuItem value={"Вышел"}>Вышел</MenuItem>
                                            <MenuItem value={"Забрал сертификаты"}>Забрал сертификаты</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <TextField
                                        className="col-12"
                                        id="comment_status"
                                        name="comment_status"
                                        value={state.comment_status}
                                        onChange={handleChange}
                                        label="Комментарий"
                                        variant="outlined"
                                        size="small"
                                        multiline={true}
                                    />

                                </Col>
                                <Col className="d-flex align-items-center">
                                    <Button variant="contained"
                                            onClick={() => updateStatus(props.rowData.id)}>
                                        Сохранить
                                    </Button>
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                    <Col className="col-3 pt-3 pb-3 pl-1 pr-2">
                        <Container className="bg-white custom-card p-3">
                            <Row>
                                <div className="header ml-3">Дополнительно:</div>
                            </Row>
                            <Row className="p-2 pl-3 pr-3">
                                <TextField
                                    className="col-12 mt-2"
                                    id="comment_status"
                                    name="note"
                                    value={state.note}
                                    onChange={handleChange}
                                    label="Примечание"
                                    variant="outlined"
                                    size="small"
                                    multiline={true}
                                />
                            </Row>
                            <Row className="p-2 pl-3 pr-3 d-flex justify-content-end">
                                <Button variant="contained"
                                        onClick={() => updateNote(props.rowData.id)}>
                                    Сохранить
                                </Button>
                            </Row>
                        </Container>
                    </Col>
                </Row>
            </Container>
        </Container>
    )
}