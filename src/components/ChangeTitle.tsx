import { splitInlineCode } from "@/lib/release-notes";

// A Change title with its backtick spans shown as <code>.
export function ChangeTitle({ title }: { title: string }) {
  return (
    <>
      {splitInlineCode(title).map((segment, i) =>
        segment.kind === "code" ? (
          <code
            key={i}
            className="rounded bg-slate-100 px-1 py-px font-mono text-[0.85em] text-slate-800"
          >
            {segment.text}
          </code>
        ) : (
          segment.text
        ),
      )}
    </>
  );
}
