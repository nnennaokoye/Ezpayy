// TypeScript declarations for AppKit custom elements
declare namespace JSX {
  interface IntrinsicElements {
    'appkit-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    'appkit-network-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    'appkit-account-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
  }
}

// Global window extensions for AppKit
declare global {
  interface Window {
    modal?: {
      open: () => void;
      close: () => void;
    };
  }
}

export {};
