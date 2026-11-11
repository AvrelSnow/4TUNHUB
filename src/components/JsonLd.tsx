/**
 * Structured data (schema.org JSON-LD) as a <script> tag.
 *
 * JSON.stringify does not make a string safe inside an HTML <script>: a value
 * containing "</script>" would close the tag early and let the rest run as
 * markup. Every JSON-LD block goes through this component so the escaping
 * lives in one place (Next.js JSON-LD guide; Semgrep react-dangerouslysetinnerhtml).
 *
 * The escapes keep the JSON valid and the parsed values identical:
 *   < > &        HTML-significant characters, as JSON unicode escapes (u003c, u003e, u0026)
 *   U+2028/2029  line separators, which some older JS parsers reject in strings
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
