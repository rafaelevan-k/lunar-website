import { ChevronDown } from "lucide-react";

/*
 * A list of questions or notes that open one by one. Built on <details>/<summary>, so it works
 * with the keyboard, with screen readers and without JavaScript.
 */
export function Accordion({ items }: { items: { title: string; body: string }[] }) {
  return (
    <div className="divide-y divide-lunar-border border-y border-lunar-border">
      {items.map((item) => (
        <details key={item.title} className="group">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 font-semibold [&::-webkit-details-marker]:hidden">
            {item.title}
            <ChevronDown
              className="size-5 shrink-0 text-lunar-text-2 transition-transform group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>
          <p className="max-w-3xl pb-5 text-lunar-text-2">{item.body}</p>
        </details>
      ))}
    </div>
  );
}
