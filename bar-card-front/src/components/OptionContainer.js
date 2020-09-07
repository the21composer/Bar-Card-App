import React from "react";
import '../App.css';
import {Container, Col, Row} from "react-bootstrap";
import Button from "@material-ui/core/Button";
import {saveAs} from "file-saver";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Tooltip from "@material-ui/core/Tooltip";

export default function OptionContainer(props) {

    const [open, setOpen] = React.useState(false);
    const [state, setState] = React.useState({
        save:true
    });

    const handleChange = (event) => {
        setState({...state, [event.target.name]:event.target.checked});
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDownload = () => {
        fetch(`/db/download`, {
            headers:{
                'Content-Type':'application/json;charset=utf-8'
            },
        })
            .then(data => data.json())
            .then(json => {
                let blob = new Blob([JSON.stringify(json, null, 2)], {type:"text/json"})
                saveAs(blob, "alcasino_db.json")
            })
    }

    const handleImport = () => {
        const input = document.getElementById('fileinput')
        const formData = new FormData();
        formData.append("file", input.files[0]);
        formData.append("save", state.save)
        fetch(`/db/import`, {
            method:"POST",
            body:formData
        })
            .then(data => data.json())
            .then(data => {
                if (data.success) {
                    props.updateTable()
                    handleClose()
                } else {
                    alert(data.error)
                }
            })
    }

    const handleSignOut = () => {
        fetch(`/sign/out`, {
            method:"POST",
            headers:{
                'Content-Type':'application/json;charset=utf-8'
            },
        })
            .then(data => data.json())
            .then(data => {
                if (data.success) {
                    props.updateAuth()
                } else {
                    alert(data.error)
                }
            })
    }


    return (
        <Container className="custom-card col-12 mt-3 p-3">
            <Row>
                <Col className="col-auto d-flex align-items-center">
                    <Button variant="outlined" onClick={handleDownload}>Бэкап данных</Button>
                </Col>
                <Col className="col-auto d-flex align-items-center">
                    <Button variant="outlined" onClick={handleClickOpen}>Импортировать</Button>
                </Col>
                <Col className="col-auto d-flex align-items-center">
                    <a href="static/instruction.pdf" target="_blank">
                        <Button variant="outlined">Помощь</Button>
                    </a>
                </Col>
                <Col className="col-auto d-flex align-items-center">
                    <Button variant="outlined" color="secondary" onClick={handleSignOut}>Выйти</Button>
                </Col>
                {props.admin &&
                    <Col className="col-auto d-flex align-items-center">
                        <Button variant="outlined" color="primary" onClick={props.updateUsers}>Администрирование</Button>
                    </Col>
                }

                <Col className="d-flex justify-content-end align-items-center">
                    <Tooltip title={<big> {props.user.email} </big>} placement="top">
                        <div>
                            Авторизован: &nbsp; <b>{props.user.name} {props.user.surname}</b>
                        </div>
                    </Tooltip>
                </Col>


            </Row>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Импорт данных</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Для импортирования используйте файл <b> бэкапа данных </b> приложения (alcasino_db.json).
                        Текущие данные можно оставить или удалить по выбору.
                    </DialogContentText>
                    <input type="file" id="fileinput" className="mb-2" accept=".json"/>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={state.save}
                                onChange={handleChange}
                                name="save"
                                color="primary"
                            />
                        }
                        label="Сохранить текущие данные"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Отмена
                    </Button>
                    <Button onClick={handleImport} color="primary">
                        Импорт
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}