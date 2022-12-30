import {useEffect, useMemo, useState, ChangeEvent} from "react";
import {useSelector, useDispatch} from "react-redux";
import Cookie from "universal-cookie";
import {Modal, Button, Row, Col, FormControl, FormGroup, Alert, Spinner} from "react-bootstrap";
import {ADDRESS_UPDATE, UPDATE_USER_IDENTIFIER} from "../store/constrains/userInfo";
import {searchNickname} from "../helper/searchNickname";
import {changeNickname, setNickname} from "../blockChain/nickname";

const UserInformation = () => {
    const [showModal, setShowModal] = useState(false);
    const [val, setVal] = useState("");
    const [valAvailable, setValAvailable] = useState(3);
    const [editing, setEditing] = useState(false);
    const [err, setErr] = useState("");
    const dispatch = useDispatch();
    const {address, nickName} = useSelector((state: { user: any }) => state.user);
    const [loading, setLoading] = useState(false);
    const cookie = useMemo(() => new Cookie(), []);

    useEffect(() => {
        const addressCookie = cookie.get("userAddress");
        const nicknameCookie = cookie.get("nickname");

        dispatch({type: ADDRESS_UPDATE, payload: addressCookie});
        if (nicknameCookie) {
            dispatch({type: UPDATE_USER_IDENTIFIER, payload: nicknameCookie});
        }
    }, [address, cookie, dispatch]);

    const openModal = () => {
        setShowModal(true);
        setEditing(false);
        setVal(nickName);
        setValAvailable(3);
    };

    const changeHandler = async (e: ChangeEvent<HTMLInputElement>) => {
        setErr("");
        const name = e.target.value.trim();
        if (name.length > 30) {
            return;
        }
        setVal(name);
        if (name.length < 3 && name.length !== 0) {
            setValAvailable(5);
            return;
        }
        if (e.target.value === "") {
            setValAvailable(4);
            return;
        }
        if (name === nickName) {
            setValAvailable(3);
            return;
        }

        const add = await searchNickname(name);
        if (add === 2) {
            // Такой никнейм уже есть
            setValAvailable(2);
        } else if (add === "") {
            // Никнейм можно брать
            setValAvailable(1);
        }
    };

    const submitHandler = async () => {
        if (valAvailable === 1 && val !== "") {
            let maybeNickName = cookie.get('nickname')
            if (maybeNickName) {
                setErr("");
                await changeNickname(maybeNickName, val, setLoading, setValAvailable, setEditing, dispatch, setErr, setShowModal);
            } else {
                setErr("");
                await setNickname(address, val, setLoading, setValAvailable, setEditing, dispatch, setErr, setShowModal);
            }
        }
    };

    return (
        <>
            <div
                className=""
                title={address}
            >
                <div className="user_info-button" onClick={openModal}>
                    <i className="far fa-user"/> {": "}
                    {nickName
                        ? nickName
                        : address.substr(0, 5) +
                        "...." +
                        address.substr(address.length - 5, address.length)}
                </div>
            </div>

            <Modal
                className="modal"
                show={showModal}
                onHide={() => {
                    setShowModal(false);
                }}
                aria-labelledby="contained-modal-title-vcenter"
            >
                <Modal.Body className="px-3">
                    <Row className="mb-3 w-100">
                        <Col xs={12} className="w-100">
                            {err && (
                                <Alert variant="danger" className="w-100 m-auto">
                                    {err}
                                </Alert>
                            )}
                        </Col>
                    </Row>

                    <Row className="mb-3 w-100 justify-content-first align-items-center align-content-center">
                        <Col xs={11}>
                            <h2 className="user_panel-title">User panel</h2>
                        </Col>
                        <Col xs={1} className="px-3" style={{textAlign: "right"}}>
                            <Button variant="transparent" className="p-0" onClick={() => setShowModal(false)}>
                                <i className="fas fa-times opacity-time"/>
                            </Button>
                        </Col>
                    </Row>

                    <Row className="align-items-center mb-3">
                        <Col xs={3} className="align-items-center ">
                            <strong> User</strong>
                        </Col>
                        <Col xs={9} style={{fontSize: "0.8rem", overflowX: "hidden"}}>
                            <a
                                target="_blank"
                                rel="noreferrer"
                                href={`https://polygonscan.com/address/${address}`}
                                title="view on etherscan.io"
                                style={{textDecoration: "none", color: "inherit"}}
                            >
                                <em>{address}</em>
                            </a>
                        </Col>
                    </Row>
                    <Row className="align-items-top mb-3">
                        <Col xs={3} className="mt-2">
                            <strong>Nickname</strong>
                        </Col>
                        <Col>
                            <FormGroup>
                                <FormControl
                                    type="text"
                                    value={val}
                                    isInvalid={valAvailable === 0 || valAvailable === 2 || valAvailable === 4 || valAvailable === 5}
                                    isValid={valAvailable === 1}
                                    disabled={!editing}
                                    onChange={changeHandler}
                                    placeholder='Enter nickname...'
                                />
                                <FormControl.Feedback
                                    type={
                                        valAvailable === 0 || valAvailable === 2 || valAvailable === 4 || valAvailable === 5
                                            ? "invalid"
                                            : "valid"
                                    }
                                >
                                    {valAvailable === 0
                                        ? "Database error please try again later"
                                        : valAvailable === 2
                                            ? "Nickname already taken"
                                            : valAvailable === 5
                                                ? "Nickname should have more than 3 letters"
                                                : valAvailable === 1
                                                    ? `Nickname ${val} is available!`
                                                    : valAvailable === 4
                                                        ? "You can't chose empty value"
                                                        : ""}
                                </FormControl.Feedback>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row className="justify-content-end px-1">
                        {!editing ? (
                            <Button
                                variant="transparent"
                                className="mx-2 edit-button w-auto"
                                onClick={() => setEditing(true)}
                            >
                                Edit nickname
                            </Button>
                        ) : (
                            <>
                                {loading ? (
                                    <Spinner
                                        animation="border"
                                        variant="black"
                                        role="status"
                                        className="mx-3 mb-2"
                                    />
                                ) : (
                                    <Button
                                        variant="transparent"
                                        className="mx-2 submit-button w-auto"
                                        onClick={submitHandler}
                                        disabled={valAvailable !== 1}
                                    >
                                        Submit
                                    </Button>
                                )}
                                <Button
                                    variant="danger"
                                    className="mx-2 w-auto"
                                    onClick={() => {
                                        setEditing(false);
                                        setVal(nickName);
                                        setValAvailable(3);
                                    }}
                                >
                                    Cancel editing
                                </Button>
                            </>
                        )}
                        {!editing && (
                            <Button variant="danger" className="w-auto mx-2" onClick={() => setShowModal(false)}>
                                Close
                            </Button>
                        )}
                    </Row>
                </Modal.Body>
            </Modal>
        </>

    )
};

export default UserInformation;
