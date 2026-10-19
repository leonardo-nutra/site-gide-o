"use client";

/**
 * Last resort: runs only if the whole layout fails, so it can't depend on the
 * site's styles or components. Plain inline styles keep it readable anywhere.
 */
export default function GlobalError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <html lang="pt-BR">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          padding: 24,
          textAlign: "center",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          color: "#1c1c1c",
        }}
      >
        <h1 style={{ margin: 0, fontSize: 24 }}>Ops, algo deu errado</h1>
        <p style={{ margin: 0, maxWidth: 420, color: "#555" }}>
          Não conseguimos carregar o site agora. Tente de novo em instantes ou
          chame a Gideão pelo WhatsApp: (21) 3589-9833.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            border: 0,
            borderRadius: 999,
            padding: "12px 28px",
            background: "#ef7f00",
            color: "#fff",
            fontSize: 15,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Tentar de novo
        </button>
      </body>
    </html>
  );
}
