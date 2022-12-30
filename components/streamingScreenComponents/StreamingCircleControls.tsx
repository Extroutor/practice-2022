import { useState } from "react";

import { Button } from "react-bootstrap";

import WithdrawalButton from "./WithdrawnButton";
import CancelStreamingButton from "./CancelStreamingButton";

import "react-circular-progressbar/dist/styles.css";

import DetailsModal from "./DetailsModal";
import ShareModal from "./ShareModal";
import HistoryModal from "./HistoryModal";

import { DetailsIcon, HistoryIcon, ShareIcon } from "../icons/StreamingControls";

type props = {
  start: Date;
  end: Date;
  amount: number;
  receiving: boolean;
  address_from: string;
  address_to: string;
  withdrawn: number;
  id: number;
  isCanceled: boolean;
  cancelDate: Date;
  isMax: boolean;
  currency: string;
  progress: number | string;
  dateDiff: { days: number; minutes: string; hours: string; seconds: string };
  cancelable: boolean;
  tx: string;
  blockDate: Date;
};

const StreamingCircleControls = ({
  start,
  end,
  amount,
  receiving,
  address_from,
  address_to,
  withdrawn,
  id,
  isCanceled,
  cancelDate,
  currency,
  progress,
  dateDiff,
  cancelable,
  tx,
  blockDate,
}: props) => {
  const [detailsModal, setDetailsModal] = useState(false);
  const [shareModal, setShareModal] = useState(false);
  const [historyModal, setHistoryModal] = useState(false);

  return (
    <>
      <div className="bg-transparent d-flex justify-content-center align-items-center mt-4">
        <div className="controller-button mx-1 text-center">
          <Button
            variant="transparent"
            onClick={() => setDetailsModal(true)}
            className="d-inline w-auto px-3 py-1 m-0"
          >
            <DetailsIcon width={45} height={45} fill="white" className="mb-3 detailsIcon" />
            <br />
            Details
          </Button>
        </div>

        <div className="controller-button mx-1 text-center h-100">
          <Button
            variant="transparent"
            className="d-inline w-auto px-3 py-1 m-0"
            onClick={() => setHistoryModal(true)}
          >
            <HistoryIcon width={45} height={45} fill="white" className="mb-3 detailsIcon" />
            <br />
            History
          </Button>
        </div>

        <div className="controller-button mx-1 text-center">
          <Button
            variant="transparent"
            className="d-inline w-auto h-100 px-3 py-1 m-0 cancelButton"
            onClick={() => setShareModal(true)}
          >
            <ShareIcon width={45} height={45} fill="white" className="mb-3 detailsIcon" />
            <br />
            Share
          </Button>
        </div>

        {receiving && (
          <WithdrawalButton
            progress={Number(progress)}
            withdrawn={withdrawn}
            id={id}
            address={address_from}
            disabled={withdrawn === 1 || withdrawn * 100 === progress}
            isCanceled={isCanceled}
            cancelDate={cancelDate}
            currency={currency}
            endDate={end}
            amount={amount}
            start={start}
            addressTo={address_to}
          />
        )}

        <CancelStreamingButton
          id={id}
          addressTo={address_to}
          addressFrom={address_from}
          disabled={progress === 100 || isCanceled}
          amount={amount}
          cancelable={cancelable}
          blockDate={blockDate}
        />
      </div>

      <DetailsModal
        show={detailsModal}
        setShow={setDetailsModal}
        progress={Number(progress)}
        isCanceled={isCanceled}
        withdrawn={withdrawn}
        address_from={address_from}
        address_to={address_to}
        receiving={receiving}
        amount={amount}
        currency={currency}
        start={start}
        end={end}
        cancelDate={cancelDate}
        dateDiff={dateDiff}
      />

      <ShareModal
        show={shareModal}
        setShow={setShareModal}
        address_from={address_from}
        address_to={address_to}
        receiving={receiving}
        tx={tx}
      />

      {id && (
        <HistoryModal
          show={historyModal}
          setShow={setHistoryModal}
          startDate={start}
          endDate={end}
          cancelDate={cancelDate}
          id={id}
          address_from={address_from}
          address_to={address_to}
          currency={currency}
          amount={amount}
          isCanceled={isCanceled}
        />
      )}
    </>
  );
};

export default StreamingCircleControls;
