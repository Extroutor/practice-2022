type props = {
  width: number;
  height: number;
  fill: string;
  className?: string;
};

export const Deposit = ({ width, height, fill, className }: props) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 17 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.74853 16.971H8.37153V18.939H9.65853C10.0125 18.939 10.2885 18.855 10.4865 18.6855C10.6845 18.5175 10.785 18.2835 10.785 17.9865C10.785 17.319 10.44 16.98 9.74853 16.971Z"
        fill={fill}
      />
      <path
        d="M10.62 15.003C10.62 14.673 10.524 14.4345 10.332 14.289C10.14 14.1435 9.83703 14.0715 9.42303 14.0715H8.37153V15.909H9.48303C10.242 15.8955 10.62 15.594 10.62 15.003Z"
        fill={fill}
      />
      <path
        d="M9 9C4.8585 9 1.5 12.3585 1.5 16.5C1.5 20.6415 4.8585 24 9 24C13.1415 24 16.5 20.6415 16.5 16.5C16.5 12.3585 13.1415 9 9 9ZM11.6175 19.5945C11.2485 19.8915 10.7445 20.061 10.1175 20.118V21H8.9205V20.145H8.0655V21H6.87V20.145H5.823V18.948H6.87V14.0505H5.823V12.855H6.87V12H8.067V12.855H8.922V12H10.119V12.8985C10.668 12.9675 11.1105 13.119 11.439 13.362C11.8965 13.701 12.1245 14.1975 12.1245 14.8515C12.1245 15.2085 12.033 15.5235 11.8485 15.795C11.6655 16.0665 11.409 16.266 11.082 16.3935C11.4555 16.4865 11.751 16.6755 11.9655 16.959C12.1815 17.2425 12.288 17.5905 12.288 18C12.288 18.7035 12.0645 19.2345 11.6175 19.5945Z"
        fill={fill}
      />
      <path
        d="M9 7.5C9.4785 7.5 9.9465 7.548 10.4055 7.6215C9.96 5.172 7.827 3.312 5.25 3.312C2.3505 3.312 0 5.6625 0 8.562C0 9.8535 0.4845 11.0205 1.257 11.934C2.826 9.2865 5.7045 7.5 9 7.5Z"
        fill={fill}
      />
      <path
        d="M10.7506 0C9.2461 0 7.9591 0.891 7.3621 2.1675C9.6376 2.9205 11.4061 4.8465 11.8696 7.311C13.3906 6.8325 14.5006 5.4285 14.5006 3.75C14.5006 1.6785 12.8206 0 10.7506 0Z"
        fill={fill}
      />
    </svg>
  );
};

export const Withdraw = ({ width, height, fill, className }: props) => {
  return (
    <svg
      width={width}
      height={height}
      className={className}
      viewBox="0 0 10 16"
      enableBackground="new 0 0 10 16"
      fill="none"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.499 11.314H4.581V12.626H5.439C5.675 12.626 5.859 12.57 5.991 12.457C6.123 12.345 6.19 12.189 6.19 11.991C6.19 11.546 5.96 11.32 5.499 11.314Z"
        fill={fill}
      />
      <path
        d="M6.08 10.002C6.08 9.782 6.016 9.623 5.888 9.526C5.76 9.429 5.558 9.381 5.282 9.381H4.581V10.606H5.322C5.828 10.597 6.08 10.396 6.08 10.002Z"
        fill={fill}
      />
      <path
        d="M5 6C2.239 6 0 8.239 0 11C0 13.761 2.239 16 5 16C7.761 16 10 13.761 10 11C10 8.239 7.761 6 5 6ZM6.745 13.063C6.499 13.261 6.163 13.374 5.745 13.412V14H4.947V13.43H4.377V14H3.58V13.43H2.882V12.632H3.58V9.367H2.882V8.57H3.58V8H4.378V8.57H4.948V8H5.746V8.599C6.112 8.645 6.407 8.746 6.626 8.908C6.931 9.134 7.083 9.465 7.083 9.901C7.083 10.139 7.022 10.349 6.899 10.53C6.777 10.711 6.606 10.844 6.388 10.929C6.637 10.991 6.834 11.117 6.977 11.306C7.121 11.495 7.192 11.727 7.192 12C7.192 12.469 7.043 12.823 6.745 13.063Z"
        fill={fill}
      />
      <path
        d="M2.001 1.999C1.871 1.999 1.74 1.979 1.621 1.929C1.49 1.869 1.381 1.799 1.291 1.709C1.2 1.619 1.131 1.509 1.07 1.379C1.02 1.259 1.001 1.129 1.001 0.999C1.001 0.869 1.021 0.739 1.07 0.619C1.131 0.499 1.2 0.389 1.291 0.289C1.381 0.199 1.49 0.129 1.621 0.079C1.98 -0.071 2.431 0.009 2.711 0.289C2.801 0.389 2.871 0.499 2.921 0.619C2.971 0.739 3.001 0.869 3.001 0.999C3.001 1.129 2.971 1.259 2.921 1.379C2.871 1.509 2.801 1.619 2.711 1.709C2.52 1.888 2.261 1.999 2.001 1.999Z"
        fill={fill}
      />
      <path
        d="M8 4C7.447 4 7 3.552 7 3V1C7 0.448 7.447 0 8 0C8.553 0 9 0.448 9 1V3C9 3.552 8.553 4 8 4Z"
        fill={fill}
      />
      <path
        d="M3 5.35V4C3 3.448 2.553 3 2 3C1.447 3 1 3.448 1 4V6.541C1.577 6.022 2.254 5.615 3 5.35Z"
        fill={fill}
      />
      <path
        d="M5 5C5.341 5 5.674 5.035 6 5.09V1C6 0.448 5.553 0 5 0C4.447 0 4 0.448 4 1V5.09C4.326 5.035 4.659 5 5 5Z"
        fill={fill}
      />
      <path
        d="M9 6.54V6C9 5.448 8.553 5 8 5C7.666 5 7.386 5.174 7.204 5.425C7.87 5.689 8.475 6.069 9 6.54Z"
        fill={fill}
      />
    </svg>
  );
};

export const ShareIcon = ({ width, height, fill, className }: props) => {
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
        d="M19.5 13.5C18.671 13.5 18 14.172 18 15V18C18 19.655 16.654 21 15 21H6C4.346 21 3 19.655 3 18V9C3 7.345 4.346 6 6 6H9C9.829 6 10.5 5.328 10.5 4.5C10.5 3.672 9.829 3 9 3H6C2.691 3 0 5.692 0 9V18C0 21.308 2.691 24 6 24H15C18.309 24 21 21.308 21 18V15C21 14.171 20.329 13.5 19.5 13.5Z"
        fill={fill}
      />
      <path
        d="M23.884 0.927C23.732 0.56 23.44 0.268 23.073 0.115C22.89 0.04 22.695 0 22.5 0H15C14.171 0 13.5 0.672 13.5 1.5C13.5 2.328 14.171 3 15 3H18.879L10.94 10.939C10.354 11.525 10.354 12.474 10.94 13.06C11.233 13.353 11.616 13.5 12 13.5C12.384 13.5 12.768 13.354 13.061 13.061L21 5.121V9C21 9.828 21.671 10.5 22.5 10.5C23.329 10.5 24 9.828 24 9V1.5C24 1.305 23.96 1.11 23.884 0.927Z"
        fill={fill}
      />
    </svg>
  );
};

export const HistoryIcon = ({ width, height, fill, className }: props) => {
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
        d="M12 23.999C6.325 23.999 1.38 19.969 0.243 14.416C0.076 13.604 0.6 12.812 1.412 12.646C2.218 12.474 3.016 13.003 3.181 13.814C4.034 17.977 7.742 20.999 11.999 20.999C16.962 20.999 20.999 16.962 20.999 11.999C20.999 7.036 16.962 2.999 11.999 2.999C8.697 3 5.665 4.805 4.086 7.711C3.689 8.438 2.778 8.708 2.051 8.312C1.323 7.917 1.054 7.006 1.449 6.278C3.554 2.406 7.597 0 12 0C18.617 0 24 5.383 24 12C24 18.617 18.617 23.999 12 23.999Z"
        fill={fill}
      />
      <path
        d="M16.499 16.5C16.213 16.5 15.925 16.419 15.668 16.248L11.168 13.248C10.751 12.969 10.5 12.501 10.5 12V6C10.5 5.172 11.171 4.5 12 4.5C12.829 4.5 13.5 5.172 13.5 6V11.197L17.332 13.752C18.022 14.211 18.208 15.143 17.748 15.832C17.46 16.265 16.984 16.5 16.499 16.5Z"
        fill={fill}
      />
      <path
        d="M6 9.369H1.5C0.671 9.369 0 8.697 0 7.869V3.369C0 2.541 0.671 1.869 1.5 1.869C2.329 1.869 3 2.541 3 3.369V6.369H6C6.829 6.369 7.5 7.041 7.5 7.869C7.5 8.697 6.83 9.369 6 9.369Z"
        fill={fill}
      />
    </svg>
  );
};

export const DetailsIcon = ({ width, height, fill, className }: props) => {
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
        d="M18 24H6C2.692 24 0 21.308 0 18V6C0 2.692 2.692 0 6 0H18C21.308 0 24 2.692 24 6V18C24 21.308 21.308 24 18 24ZM6 3C4.346 3 3 4.346 3 6V18C3 19.655 4.345 21 6 21H18C19.655 21 21 19.655 21 18V6C21 4.345 19.655 3 18 3H6Z"
        fill={fill}
      />
      <path
        d="M12 9C12.8284 9 13.5 8.32843 13.5 7.5C13.5 6.67157 12.8284 6 12 6C11.1716 6 10.5 6.67157 10.5 7.5C10.5 8.32843 11.1716 9 12 9Z"
        fill={fill}
      />
      <path
        d="M12 18C11.172 18 10.5 17.328 10.5 16.5V12C10.5 11.172 11.172 10.5 12 10.5C12.828 10.5 13.5 11.172 13.5 12V16.5C13.5 17.328 12.829 18 12 18Z"
        fill={fill}
      />
    </svg>
  );
};

export const CancelIcon = ({ width, height, fill, className }: props) => {
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
        d="M18 0H6C2.691 0 0 2.6925 0 6V18C0 21.309 2.691 24 6 24H18C21.309 24 24 21.309 24 18V6C24 2.6925 21.309 0 18 0ZM21 18C21 19.6545 19.6545 21 18 21H6C4.3455 21 3 19.6545 3 18V6C3 4.3455 4.3455 3 6 3H18C19.6545 3 21 4.3455 21 6V18Z"
        fill={fill}
      />
      <path
        d="M17.5605 6.4395C16.974 5.853 16.026 5.853 15.4395 6.4395L12 9.879L8.5605 6.4395C7.974 5.853 7.026 5.853 6.4395 6.4395C5.853 7.026 5.853 7.974 6.4395 8.5605L9.879 12L6.4395 15.4395C5.853 16.026 5.853 16.974 6.4395 17.5605C6.732 17.8545 7.116 18 7.5 18C7.884 18 8.268 17.853 8.5605 17.5605L12 14.121L15.4395 17.5605C15.732 17.8545 16.116 18 16.5 18C16.884 18 17.268 17.853 17.5605 17.5605C18.147 16.974 18.147 16.026 17.5605 15.4395L14.121 12L17.5605 8.5605C18.147 7.9755 18.147 7.026 17.5605 6.4395Z"
        fill={fill}
      />
    </svg>
  );
};
