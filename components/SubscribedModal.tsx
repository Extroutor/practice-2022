import { useRef } from "react";

import { Modal, Button } from "react-bootstrap";

type props = {
  show: boolean;
  setShow: Function;
  email: string;
  setEmail: Function;
};

const ShareModal = ({ setEmail, email, show, setShow }: props) => {
  const ref = useRef<HTMLDivElement>(null);
  const closeHandler = () => {
    setShow(false), setEmail("");
  };
  return (
    <Modal
      className="modal p-4 subscription-modal"
      show={show}
      onHide={closeHandler}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      close
    >
      <Modal.Body>
        <div className="p-1">Email: {email} have been subsecribed to our mailling list.</div>
        <div className="d-flex flex-row-reverse mt-1">
          <Button variant="transparent" className="third-color-button" onClick={closeHandler}>
            Close
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ShareModal;
