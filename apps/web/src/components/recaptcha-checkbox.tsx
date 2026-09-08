import { useEffect, useRef } from "react";

declare global {
  interface Window {
    grecaptcha?: {
      render: (
        container: HTMLElement,
        parameters: {
          sitekey: string;
          theme?: "light" | "dark";
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        },
      ) => number;
      reset: (widgetId?: number) => void;
      getResponse: (widgetId?: number) => string;
    };
  }
}

const SCRIPT_ID = "google-recaptcha-v2";

function loadScript(): Promise<void> {
  if (window.grecaptcha?.render) return Promise.resolve();
  const existing = document.getElementById(SCRIPT_ID);
  if (existing) {
    return new Promise((resolve) => {
      existing.addEventListener("load", () => resolve(), { once: true });
    });
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Could not load captcha."));
    document.head.appendChild(script);
  });
}

type RecaptchaCheckboxProps = {
  siteKey: string;
  onTokenChange: (token: string) => void;
};

export function RecaptchaCheckbox({
  siteKey,
  onTokenChange,
}: RecaptchaCheckboxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const theme = document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";

    loadScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.grecaptcha) return;
        if (widgetIdRef.current !== null) return;
        widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
          sitekey: siteKey,
          theme,
          callback: onTokenChange,
          "expired-callback": () => onTokenChange(""),
          "error-callback": () => onTokenChange(""),
        });
      })
      .catch(() => {
        if (!cancelled) onTokenChange("");
      });

    return () => {
      cancelled = true;
      if (widgetIdRef.current !== null && window.grecaptcha) {
        try {
          window.grecaptcha.reset(widgetIdRef.current);
        } catch {
          // widget already gone with the dialog
        }
        widgetIdRef.current = null;
      }
    };
  }, [onTokenChange, siteKey]);

  return <div className="min-h-20" ref={containerRef} />;
}
