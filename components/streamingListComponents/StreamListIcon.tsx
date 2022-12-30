type props = { receiving: boolean; isCanceled: boolean; progress: number | string };

import { ReceivingIcon, SendingIcon } from "../icons/ListItemIcons";

const StreamingListIcon = ({ receiving, isCanceled, progress }: props) => {
  return (
    <span>
      {isCanceled ? (
        <>
          <i title="canceled" className="fas fa-times opacity-time" />{" "}
          <span className="d-md-none">canceled</span>
        </>
      ) : progress === 100 ? (
        <>
          <i title="completed" className="fas fa-check opacity-time" />{" "}
          <span className="d-md-none">completed</span>
        </>
      ) : receiving ? (
        <>
          <ReceivingIcon width={20} height={20} fill="#ffffffbb" />{" "}
          <span className="d-md-none">receiving</span>
        </>
      ) : (
        <>
          <SendingIcon width={20} height={20} fill="#ffffffbb" />{" "}
          <span className="d-md-none">streaming</span>
        </>
      )}
    </span>
  );
};

export default StreamingListIcon;
