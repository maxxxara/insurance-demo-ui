import { useCallback, useEffect, useState } from "react";
import { listReferrals, type ReferralSummary } from "../api/client";
import { PlusIcon, RefreshIcon, SidebarIcon } from "./Icons";

const STATUS_LABELS: Record<ReferralSummary["status"], string> = {
  PENDING: "მოლოდინში",
  PROCESSING: "მუშავდება",
  COMPLETED: "დასრულებული",
  FAILED: "ჩავარდნილი",
};

const STATUS_PILLS: Record<ReferralSummary["status"], string> = {
  PENDING: "pill--wait",
  PROCESSING: "pill--wait",
  COMPLETED: "pill--ok",
  FAILED: "pill--fail",
};

const dateFormat = new Intl.DateTimeFormat("ka-GE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const formatDate = (iso: string) => {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "—" : dateFormat.format(date);
};

type SidebarProps = {
  open: boolean;
  onToggle: () => void;
  /** Request currently shown in the main pane, so its row reads as selected. */
  selectedId: string | null;
  onSelect: (requestId: string) => void;
  onNew: () => void;
  /** Bumped by the parent after a submit to pull the fresh list. */
  refreshToken: number;
};

const Sidebar = ({
  open,
  onToggle,
  selectedId,
  onSelect,
  onNew,
  refreshToken,
}: SidebarProps) => {
  const [items, setItems] = useState<ReferralSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);

    try {
      const list = await listReferrals(signal);
      if (signal?.aborted) return;
      setItems(list.items);
    } catch (caught) {
      if (signal?.aborted) return;
      setError(
        caught instanceof Error ? caught.message : "სია ვერ ჩაიტვირთა",
      );
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [load, refreshToken]);

  return (
    <>
      <button
        type="button"
        className="sidebar-toggle"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls="referral-sidebar"
        aria-label={open ? "პანელის დამალვა" : "პანელის ჩვენება"}
        title={open ? "პანელის დამალვა" : "პანელის ჩვენება"}
      >
        <SidebarIcon />
      </button>

      <aside
        id="referral-sidebar"
        className={`sidebar${open ? " sidebar--open" : ""}`}
        aria-hidden={!open}
      >
        <div className="sidebar__head">
          <span className="sidebar__title">მიმართვები</span>
          <button
            type="button"
            className="sidebar__refresh"
            onClick={() => void load()}
            disabled={loading}
            aria-label="განახლება"
            title="განახლება"
          >
            <RefreshIcon />
          </button>
        </div>

        <button type="button" className="sidebar__new" onClick={onNew}>
          <PlusIcon />
          ახალი მიმართვა
        </button>

        <div className="sidebar__list">
          {loading && items.length === 0 && (
            <p className="sidebar__note">იტვირთება…</p>
          )}

          {error && <p className="sidebar__note sidebar__note--error">{error}</p>}

          {!loading && !error && items.length === 0 && (
            <p className="sidebar__note">მიმართვები ჯერ არ არის</p>
          )}

          {items.map((item) => (
            <button
              key={item.requestId}
              type="button"
              className={`sidebar-item${
                item.requestId === selectedId ? " sidebar-item--active" : ""
              }`}
              onClick={() => onSelect(item.requestId)}
            >
              <span className="sidebar-item__top">
                <span className="sidebar-item__name">
                  {item.patientName ?? "უცნობი პაციენტი"}
                </span>
                <span className={`pill pill--sm ${STATUS_PILLS[item.status]}`}>
                  {STATUS_LABELS[item.status]}
                </span>
              </span>

              <span className="sidebar-item__clinic">
                {item.clinicName ?? "—"}
              </span>

              <span className="sidebar-item__meta">
                <span>{formatDate(item.createdAt)}</span>
                <span>{item.referralCount} მიმართვა</span>
              </span>
            </button>
          ))}
        </div>
      </aside>

      {open && <div className="sidebar__backdrop" onClick={onToggle} />}
    </>
  );
};

export default Sidebar;
