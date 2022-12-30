import { Modal } from "react-bootstrap";

import { RampInstantSDK } from "@ramp-network/ramp-instant-sdk";

import { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { HIDE_BUY_CURRANCY_MODAL } from "../../store/constrains/currancyModal";
type props = {
  show: boolean;
  setShow: Function;
  currancy: string;
};

const CurrancyBuyModal = () => {
  const { show, currancy } = useSelector((state: any) => state.modal);
  const ref = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();
  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "650px";
      ref.current.style.width = "900px";

      const data = new RampInstantSDK({
        hostAppName: "ctrlX",
        hostLogoUrl: "https://cdn-images-1.medium.com/max/2600/1*nqtMwugX7TtpcS-5c3lRjw.png",
        variant: "embedded-desktop",
        containerNode: ref.current,
        swapAsset: currancy,
      }).show();
    }
  }, [ref, show]);

  const hideHandler = () => {
    dispatch({ type: HIDE_BUY_CURRANCY_MODAL });
    if (ref.current) {
      ref.current.innerHTML = "";
    }
  };
  return (
      <Modal
          className="modal modal-money"
          show={show}
          onHide={hideHandler}
          aria-labelledby="contained-modal-title-vcenter"
          centered
          style={{
            zIndex: 9999,
            backgroundColor: "none",
            border: "0 !important",
          }}
      >
        <div ref={ref} id="money" />
      </Modal>
  );
};

export default CurrancyBuyModal;
