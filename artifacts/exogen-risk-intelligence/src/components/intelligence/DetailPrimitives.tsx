import { useEffect, useState, type ReactNode } from 'react';
import { AlertTriangle, ArrowUpRight, X } from 'lucide-react';

export function SectionHeading({
  eyebrow,
  title,
  detail,
  action,
}: {
  eyebrow?: string;
  title: string;
  detail?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        {eyebrow && <p className="mb-1.5 text-[9px] font-semibold tracking-[.16em] text-[#7b858a]">{eyebrow}</p>}
        <h2 className="text-[17px] font-semibold tracking-[-.025em] text-[#f2f3ef] sm:text-[19px]">{title}</h2>
        {detail && <p className="mt-1.5 max-w-3xl text-[12px] leading-5 text-[#8b9499]">{detail}</p>}
      </div>
      {action}
    </div>
  );
}

export function WhyButton({ onClick, label = 'Why?' }: { onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={`why-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
      className="inline-flex min-h-7 items-center gap-1 rounded border border-[#30373a] px-2 text-[10px] font-medium text-[#b6c0c2] transition-colors hover:border-[#8aab48] hover:text-[#c4f56a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8f34a]"
      aria-label={`Explain ${label}`}
    >
      {label} <ArrowUpRight size={11} aria-hidden="true" />
    </button>
  );
}

export function DetailDrawer({
  open,
  title,
  eyebrow,
  onClose,
  children,
  testId = 'detail-drawer',
}: {
  open: boolean;
  title: string;
  eyebrow?: string;
  onClose: () => void;
  children: ReactNode;
  testId?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] flex justify-end" data-testid={testId}>
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-black/60"
        onClick={onClose}
        aria-label="Close details"
        data-testid="drawer-backdrop"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative flex h-full w-full max-w-[520px] flex-col border-l border-[#30373a] bg-[#101416] shadow-2xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-[#252c2f] px-5 py-5 sm:px-7">
          <div>
            {eyebrow && <p className="mb-1 text-[9px] font-semibold tracking-[.16em] text-[#a9d34f]">{eyebrow}</p>}
            <h2 className="text-[18px] font-semibold tracking-[-.025em] text-[#f2f3ef]">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded border border-[#30373a] text-[#9aa3a7] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8f34a]"
            aria-label="Close drawer"
            data-testid="drawer-close"
          >
            <X size={16} />
          </button>
        </header>
        <div className="soft-scrollbar flex-1 overflow-y-auto px-5 py-5 sm:px-7">{children}</div>
      </aside>
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <main className="page-enter mx-auto w-full max-w-[1440px] px-4 pb-14 pt-5 sm:px-6 lg:px-8" aria-label="Loading signal intelligence">
      <div className="mb-5 h-9 w-full animate-pulse rounded border border-[#242b2e] bg-[#111719]" />
      <div className="panel mb-5 p-5 sm:p-7">
        <div className="h-3 w-32 animate-pulse rounded bg-[#222a2d]" />
        <div className="mt-5 h-8 max-w-2xl animate-pulse rounded bg-[#222a2d]" />
        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => <div key={index} className="h-24 animate-pulse rounded border border-[#232a2d] bg-[#14191b]" />)}
        </div>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        {Array.from({ length: 6 }, (_, index) => <div key={index} className="panel h-64 animate-pulse bg-[#111719]" />)}
      </div>
    </main>
  );
}

export function DetailError({
  title = 'INTELLIGENCE DETAIL UNAVAILABLE',
  message = 'The signal is known, but its intelligence chain could not be assembled.',
  onRetry,
  onBack,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
  onBack?: () => void;
}) {
  return (
    <section className="mx-auto my-12 max-w-2xl rounded-[9px] border border-[#493739] bg-[#171416] p-6 sm:p-8" role="alert" data-testid="detail-error">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded border border-[#754447] bg-[#24191b] text-[#ff8580]"><AlertTriangle size={18} /></div>
      <p className="text-[9px] font-semibold tracking-[.16em] text-[#ff8580]">{title}</p>
      <h2 className="mt-2 text-[20px] font-semibold text-[#f1f1ed]">The evidence trail is incomplete</h2>
      <p className="mt-2 max-w-lg text-[13px] leading-6 text-[#a4abad]">{message}</p>
      <p className="mt-4 border-l border-[#a24d50] pl-3 text-[11px] leading-5 text-[#8f999c]">
        No live venue or company data was requested. This demo view only uses the bundled illustrative scenarios.
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        {onRetry && <button type="button" onClick={onRetry} className="rounded border border-[#3b4548] px-3 py-2 text-[11px] text-[#e8eae5] hover:border-[#b8f34a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8f34a]" data-testid="detail-retry">Retry detail</button>}
        {onBack && <button type="button" onClick={onBack} className="rounded px-3 py-2 text-[11px] text-[#a1aaad] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8f34a]" data-testid="detail-back">Return to signal list</button>}
      </div>
    </section>
  );
}

export function DefinitionRow({ label, children, mono = false }: { label: string; children: ReactNode; mono?: boolean }) {
  return (
    <div className="flex flex-col gap-1 border-b border-[#252c2f] py-3 last:border-0 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
      <dt className="shrink-0 text-[10px] uppercase tracking-[.1em] text-[#737e82]">{label}</dt>
      <dd className={`min-w-0 text-[12px] leading-5 text-[#c5ccca] sm:text-right ${mono ? 'mono break-all text-[11px]' : ''}`}>{children}</dd>
    </div>
  );
}

export function TogglePanel({
  title,
  hint,
  children,
  testId,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
  testId: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded border border-[#293134] bg-[#111719]">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="flex min-h-12 w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-[#151b1d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#b8f34a]"
        data-testid={testId}
      >
        <span>
          <span className="block text-[12px] font-medium text-[#dfe3df]">{title}</span>
          {hint && <span className="mt-1 block text-[10px] text-[#7f898d]">{hint}</span>}
        </span>
        <span className="mono text-[11px] text-[#b8f34a]">{open ? '−' : '+'}</span>
      </button>
      {open && <div className="border-t border-[#293134] px-4 py-4">{children}</div>}
    </div>
  );
}