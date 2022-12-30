import { useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";

import { CancelIcon } from "../icons/StreamingControls";

import cancelStream from "../../blockChain/cancelStream";

type props = {
  id: number;
  addressTo: string;
  addressFrom: string;
  disabled: boolean;
  amount: number;
  cancelable: boolean;
  blockDate: Date;
};

const WithdrawalButton = ({
  id,
  addressTo,
  addressFrom,
  disabled,
  amount,
  cancelable,
  blockDate,
}: props) => {
  const [loading, setLoading] = useState(false);

  const { socket } = useSelector((state: any) => state.socket);

  const dispatch = useDispatch();

  const clickHandler = async () => {
    await cancelStream(id, addressTo, addressFrom, setLoading, socket, amount, dispatch);
  };
  return (
    <div className="controller-button mx-1 text-center">
      <button
        // variant="transparent"
        onClick={clickHandler}
        className="d-inline w-auto px-3 py-1 m-0 cancelButton"
        disabled={disabled || !cancelable || Date.now() < Number(blockDate)}
      >
        {loading ? (
          <Spinner
            animation="border"
            variant="white"
            style={{ height: "50px", width: "50px" }}
            className="mx-3 mb-2"
          />
        ) : (
          <CancelIcon width={45} height={45} fill="white" className="mb-3 detailsIcon" />
        )}
        <br />
        Cancel
      </button>
    </div>
  );
};

export default WithdrawalButton;
