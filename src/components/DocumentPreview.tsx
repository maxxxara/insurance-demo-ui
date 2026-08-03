import { useEffect, useId, useRef, useState } from "react";
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

const DocumentPreview = ({ pages, page, polys }: DocumentPreviewProps) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const [zoomed, setZoomed] = useState(false);
  const source = pages[page - 1];

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
          aria-label="დოკუმენტის გადიდება"
        >
          <img
            className="preview__image"
            src={source}
            alt={alt}
            onLoad={scrollToHighlight}
          />
          <Highlight polys={polys} />
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
