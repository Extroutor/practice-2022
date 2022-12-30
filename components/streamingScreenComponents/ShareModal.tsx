import { useRef, MouseEvent } from "react";

import { Row, Col, Modal, Button } from "react-bootstrap";

import {
  ShareLinkReceiver,
  ShareLinkEtherScan,
  ShareLinkSender,
  ShareLinkShare,
} from "../../components/icons/ShareModal";

type props = {
  address_from: string;
  address_to: string;
  show: boolean;
  setShow: Function;
  receiving: boolean;
  tx: string;
};

const ShareModal = ({ receiving, address_from, address_to, tx, show, setShow }: props) => {
  const ref = useRef<HTMLDivElement>(null);

  const copyHandler = (text: string, e: MouseEvent) => {
    window.navigator.clipboard.writeText(text);
    if (ref.current) {
      ref.current.style.opacity = "1";

      setTimeout(() => {
        //@ts-ignore
        if (ref.current) ref.current.style.opacity = "0";
      }, 3000);
    }
  };

  return (
    <Modal
      className="modal"
      show={show}
      onHide={() => setShow(false)}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body>
        <Row className="mb-3 justify-content-first align-items-center align-content-center">
          <Col xs={3}>
            <h2 className="m-0 p-0">Links</h2>
          </Col>
          <Col xs={7}>
            <div ref={ref} style={{ opacity: 0 }} className="copied-div">
              Copied!
            </div>
          </Col>
          <Col xs={2} className="px-3">
            <Button variant="transparent" className="p-0" onClick={() => setShow(false)}>
              <i className="fas fa-times opacity-time" />
            </Button>
          </Col>
        </Row>

        <Row className="p-0">
          <Col xs={6}>
            <div className="share-button mx-1 text-center p-0 m-0">
              <Button
                variant="transparent"
                className="d-inline w-auto px-3 py-1 px-0 m-0"
                onClick={(e) => copyHandler(address_from, e)}
              >
                <ShareLinkSender
                  width={30}
                  height={30}
                  fill="#14142Caa"
                  className="share-icon mb-3"
                />
                <br />
                Copy Sender Link
                <br />
                {!receiving && "(You)"}
              </Button>
            </div>
          </Col>
          <Col xs={6}>
            <div className="share-button mx-1 text-center p-0 m-0">
              <Button
                variant="transparent"
                className="d-inline w-auto px-3 py-1 px-0 m-0"
                onClick={(e) => copyHandler(address_to, e)}
              >
                <ShareLinkReceiver
                  width={30}
                  height={30}
                  fill="#14142Caa"
                  className="share-icon mb-3"
                />
                <br />
                Copy Receiver Link
                <br />
                {receiving && "(You)"}
              </Button>
            </div>
          </Col>
        </Row>
        <Row className="p-0 mt-3">
          <Col xs={6}>
            <div className="share-button mx-1 text-center p-0 m-0">
              <a
                className="share-link"
                target="_blank"
                rel="noreferrer"
                href={`https://kovan.etherscan.io/tx/${tx}`}
              >
                <Button
                  variant="transparent"
                  className="d-inline w-auto px-3 py-1 px-0 m-0"
                  onClick={() => {}}
                >
                  <ShareLinkEtherScan
                    width={30}
                    height={30}
                    fill="#14142Caa"
                    className="share-icon mb-3"
                  />
                  <br />
                  View on Etherscan
                </Button>
              </a>
            </div>
          </Col>

          <Col xs={6}>
            <div className="share-button mx-1 text-center p-0 m-0">
              <Button
                variant="transparent"
                className="d-inline w-auto px-3 py-1 px-0 m-0"
                onClick={() => {}}
              >
                <ShareLinkShare
                  width={30}
                  height={30}
                  fill="#14142Caa"
                  className="share-icon mb-3"
                />
                <br />
                Share stream
              </Button>
            </div>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default ShareModal;
