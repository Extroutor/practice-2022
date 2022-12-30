type props = {
  width: number;
  height: number;
  fill: string;
  className?: string;
};

export const StartStreamSymbol = ({ width, height, fill, className }: props) => {
  return (
    <svg
      width={width}
      height={height}
      className={className}
      viewBox="0 0 16 16"
      enableBackground="new 0 0 16 16"
      fill="none"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 0H4C1.794 0 0 1.794 0 4V12C0 14.206 1.794 16 4 16H12C14.206 16 16 14.206 16 12V4C16 1.794 14.206 0 12 0ZM14 12C14 13.103 13.103 14 12 14H4C2.897 14 2 13.103 2 12V4C2 2.897 2.897 2 4 2H12C13.103 2 14 2.897 14 4V12Z"
        fill={fill}
      />
      <path
        d="M7.293 5.856L8.586 7.149H4V9.149H8.586L7.293 10.442L8.707 11.856L12.414 8.149L8.707 4.442L7.293 5.856Z"
        fill={fill}
      />
    </svg>
  );
};

export const StartStreamBitSymbol = ({ width, height, fill, className }: props) => {
  return (
    <svg
      width={width}
      height={height}
      className={className}
      viewBox="0 0 24 24"
      enableBackground="new 0 0 24 24"
      fill="none"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 24H6C2.691 24 0 21.309 0 18V6C0 2.691 2.691 0 6 0H18C21.309 0 24 2.691 24 6V18C24 21.309 21.309 24 18 24ZM6 3C4.3455 3 3 4.3455 3 6V18C3 19.6545 4.3455 21 6 21H18C19.6545 21 21 19.6545 21 18V6C21 4.3455 19.6545 3 18 3H6Z"
        fill={fill}
      />
      <path
        d="M17.3866 14.5035C17.3866 13.8195 17.2066 13.2405 16.8481 12.768C16.4896 12.2955 15.9976 11.9805 15.3751 11.8245C15.9211 11.613 16.3456 11.28 16.6516 10.827C16.9576 10.374 17.1106 9.849 17.1106 9.2535C17.1106 8.163 16.7296 7.335 15.9676 6.771C15.4201 6.366 14.6821 6.1125 13.7686 5.997V4.5H11.7751V5.925H10.3501V4.5H8.35659V5.925H6.61359V7.9185H8.35809V16.0815H6.61359V18.075H8.35809V19.5H10.3516V18.075H11.7766V19.5H13.7701V18.03C14.8141 17.9355 15.6556 17.652 16.2691 17.157C17.0146 16.557 17.3866 15.672 17.3866 14.5035ZM10.8616 7.953H12.6136C13.3036 7.953 13.8091 8.0745 14.1286 8.316C14.4481 8.5575 14.6086 8.955 14.6086 9.5055C14.6086 10.491 13.9771 10.9935 12.7141 11.016H10.8616V7.953ZM14.3866 15.6435C14.0566 15.924 13.5961 16.065 13.0051 16.065H10.8601V12.7845H13.1551C14.3071 12.801 14.8831 13.3665 14.8831 14.478C14.8831 14.9745 14.7181 15.3615 14.3866 15.6435Z"
        fill={fill}
      />
    </svg>
  );
};
