type props = {
  width: number;
  height: number;
  fill: string;
  className?: string;
};

export const SendingIcon = ({ width, height, fill, className }: props) => {
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
        d="M12 0H4C1.794 0 0 1.795 0 4V12C0 14.206 1.794 16 4 16H12C14.206 16 16 14.206 16 12V4C16 1.795 14.206 0 12 0ZM14 12C14 13.103 13.103 14 12 14H4C2.897 14 2 13.103 2 12V4C2 2.897 2.897 2 4 2H12C13.103 2 14 2.897 14 4V12Z"
        fill={fill}
      />
      <path d="M6 7H7.586L4.293 10.293L5.707 11.707L9 8.414V10H11V5H6V7Z" fill={fill} />
    </svg>
  );
};

export const ReceivingIcon = ({ width, height, fill, className }: props) => {
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
        d="M12 0H4C1.794 0 0 1.795 0 4V12C0 14.206 1.794 16 4 16H12C14.206 16 16 14.206 16 12V4C16 1.795 14.206 0 12 0ZM14 12C14 13.103 13.103 14 12 14H4C2.897 14 2 13.103 2 12V4C2 2.897 2.897 2 4 2H12C13.103 2 14 2.897 14 4V12Z"
        fill={fill}
      />
      <path d="M10.293 4.293L7 7.586V6H5V11H10V9H8.414L11.707 5.707L10.293 4.293Z" fill={fill} />
    </svg>
  );
};
