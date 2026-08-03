import { useEffect, useId, useRef } from "react";
import type { MockPoly } from "../data/mockAnchors";

const toPoints = (poly: MockPoly): string =>
  poly.map(([x, y]) => `${x},${y}`).join(" ");

type DocumentPreviewProps = {
  /** Page image URLs, index 0 being page 1. */
  pages: string[];
  /** 1-based page to display. */
  page: number;
  /** Highlights on that page, in normalized page coordinates. */
  polys: MockPoly[];
};

const DocumentPreview = ({ pages, page, polys }: DocumentPreviewProps) => {
  const maskId = useId();
  const stageRef = useRef<HTMLDivElement>(null);
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

  if (!source) return null;

  return (
    <div className="preview">
      <div className="preview__head">
        <span className="preview__title">დოკუმენტი</span>
        <span className="preview__page">
          გვერდი {page} / {pages.length}
        </span>
      </div>

      <div className="preview__stage" ref={stageRef}>
        <img
          className="preview__image"
          src={source}
          alt={`დოკუმენტის გვერდი ${page}`}
          onLoad={scrollToHighlight}
        />

        {polys.length > 0 && (
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
        )}
      </div>

      <p className="preview__hint">
        {polys.length > 0
          ? "მონიშნულია ადგილი, საიდანაც მონაცემი ამოიკითხა"
          : "გადაატარეთ მაუსი დიაგნოზს ან მიმართვას დოკუმენტში ადგილის სანახავად"}
      </p>
    </div>
  );
};

export default DocumentPreview;
