/// <reference types="vite/client" />

interface Window {
  Jupiter?: {
    init: (config: {
      displayMode: string;
      integratedTargetId: string;
      defaultInputMint: string;
      defaultOutputMint: string;
      theme: {
        mode: string;
        primary: string;
        secondary: string;
      };
    }) => void;
  };
}
