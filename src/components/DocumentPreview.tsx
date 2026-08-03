import { useEffect, useId, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { createPortal } from "react-dom";
import type { MockPoly } from "../data/mockAnchors";

const toPoints = (poly: MockPoly): string =>
  poly.map(([x, y]) => `${x},${y}`).join(" ");

/** Dims the page and outlines the region a value was read from. */
const Highlight = ({ polys }: { polys: MockPoly[] }) => {
  const maskId = useId();
  if (polys.length === 0) return null;

  return (
    <svg
      className="preview__overlay"
      viewBox="0 0 1 1"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <mask id={maskId}>
          <rect x="0" y="0" width="1" height="1" fill="white" />
          {polys.map((poly, index) => (
            <polygon key={index} points={toPoints(poly)} fill="black" />
          ))}
        </mask>
      </defs>

      <rect
        className="preview__dim"
        x="0"
        y="0"
        width="1"
        height="1"
        mask={`url(#${maskId})`}
      />

      {polys.map((poly, index) => (
        <polygon
          key={index}
          className="preview__box"
          points={toPoints(poly)}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
};

type DocumentPreviewProps = {
  /** Page image URLs, index 0 being page 1. */
  pages: string[];
  /** 1-based page to display. */
  page: number;
  /** Highlights on that page, in normalized page coordinates. */
  polys: MockPoly[];
};

/** Diameter of the hover magnifier, and how much it enlarges the page. */
const LENS_SIZE = 190;
const LENS_SCALE = 2.6;

const DocumentPreview = ({ pages, page, polys }: DocumentPreviewProps) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const [zoomed, setZoomed] = useState(false);
  /** Cursor position inside the trigger, in px — null when not hovering. */
  const [lens, setLens] = useState<{ x: number; y: number } | null>(null);
  const [frame, setFrame] = useState({ width: 0, height: 0 });
  const source = pages[page - 1];

  const trackLens = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.pointerType !== "mouse") return;

    const rect = event.currentTarget.getBoundingClientRect();
    setFrame({ width: rect.width, height: rect.height });
    setLens({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  };

  const scrollToHighlight = () => {
    const stage = stageRef.current;
    if (!stage || polys.length === 0) return;

    const ys = polys.flatMap((poly) => poly.map(([, y]) => y));
    const center = (Math.min(...ys) + Math.max(...ys)) / 2;
    const top = center * stage.scrollHeight - stage.clientHeight / 2;

    stage.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  };

  useEffect(scrollToHighlight, [polys, page]);

  useEffect(() => {
    if (!zoomed) return;

    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setZoomed(false);
    };
    const previous = document.body.style.overflow;

    document.addEventListener("keydown", close);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", close);
      document.body.style.overflow = previous;
    };
  }, [zoomed]);

  if (!source) return null;

  const alt = `დოკუმენტის გვერდი ${page}`;

  return (
    <div className="preview">
      <div className="preview__head">
        <span className="preview__title">დოკუმენტი</span>
        <span className="preview__page">
          გვერდი {page} / {pages.length}
        </span>
      </div>

      <div className="preview__stage" ref={stageRef}>
        <button
          type="button"
          className="preview__trigger"
          onClick={() => setZoomed(true)}
          onPointerMove={trackLens}
          onPointerLeave={() => setLens(null)}
          aria-label="დოკუმენტის გადიდება"
        >
          <img
            className="preview__image"
            src={source}
            alt={alt}
            onLoad={scrollToHighlight}
          />
          <Highlight polys={polys} />

          {lens && !zoomed && (
            <span
              className="preview__lens"
              style={{
                width: LENS_SIZE,
                height: LENS_SIZE,
                left: lens.x,
                top: lens.y,
              }}
              aria-hidden="true"
            >
              <span
                className="preview__lens-content"
                style={{
                  width: frame.width * LENS_SCALE,
                  height: frame.height * LENS_SCALE,
                  transform: `translate(${LENS_SIZE / 2 - lens.x * LENS_SCALE}px, ${
                    LENS_SIZE / 2 - lens.y * LENS_SCALE
                  }px)`,
                }}
              >
                <img className="preview__lens-image" src={source} alt="" />
                <Highlight polys={polys} />
              </span>
            </span>
          )}
        </button>
      </div>

      <p className="preview__hint">
        {polys.length > 0
          ? "მონიშნულია ადგილი, საიდანაც მონაცემი ამოიკითხა · დააჭირეთ გასადიდებლად"
          : "გადაატარეთ მაუსი დიაგნოზს ან მიმართვას დოკუმენტში ადგილის სანახავად"}
      </p>

      {zoomed &&
        createPortal(
          <div
            className="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={alt}
            onClick={() => setZoomed(false)}
          >
            <button
              type="button"
              className="lightbox__close"
              onClick={() => setZoomed(false)}
              aria-label="დახურვა"
            >
              ✕
            </button>

            <div
              className="lightbox__frame"
              onClick={(event) => event.stopPropagation()}
            >
              <img className="lightbox__image" src={source} alt={alt} />
              <Highlight polys={polys} />
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default DocumentPreview;
