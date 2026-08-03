/**
 * Source-document highlights for the demo file `ფ100 2.pdf`.
 *
 * The API does not return coordinates yet, so these are frozen: the page images
 * live in public/mock/f100 and the quads below came from a one-off Document AI
 * OCR pass over that same PDF, in normalized (0..1) page space. The pages are
 * photographed at a slight angle, which is why each box is a quad rather than a
 * rectangle — they sit on the text the way the real thing would.
 *
 * Anchors are keyed by the service or ICD-10 code that appears in the displayed
 * value rather than by field index, so they stay correct however the extraction
 * happens to order its results.
 */

export type MockPoly = [number, number][];

export type MockAnchor = {
  /** Code that identifies the value, e.g. "HR.3.6" or "E03.9". */
  key: string;
  /** 1-based page number, indexing MOCK_PAGES. */
  page: number;
  /** One quad per document line; a wrapped value has several. */
  polys: MockPoly[];
};

/** Highlights only apply to this document — any other upload gets the plain view. */
const MOCK_DOCUMENT_STEM = "ფ100 2";

export const MOCK_PAGES = [
  "/mock/f100/page-1.jpg",
  "/mock/f100/page-2.jpg",
  "/mock/f100/page-3.jpg",
];

export const MOCK_ANCHORS: MockAnchor[] = [
  // E03.9 ჰიპოთირეოზი, დაუზუსტებელი
  {
    key: "E03.9",
    page: 1,
    polys: [
      [
        [0.1889, 0.6052],
        [0.4349, 0.6052],
        [0.4349, 0.6153],
        [0.1889, 0.6153],
      ],
    ],
  },
  // R73,9 ჰიპერგლიკემია, დაუზუსტებელი
  {
    key: "R73.9",
    page: 1,
    polys: [
      [
        [0.1872, 0.6204],
        [0.4462, 0.6204],
        [0.4462, 0.6309],
        [0.1872, 0.6309],
      ],
    ],
  },
  // E78.2 შერეული ჰიპერლიპიდემია
  {
    key: "E78.2",
    page: 1,
    polys: [
      [
        [0.186, 0.6351],
        [0.4147, 0.6351],
        [0.4147, 0.6456],
        [0.186, 0.6456],
      ],
    ],
  },
  // • E78.0 ჭეშმარიტი ჰიპერქოლესტერინემია
  {
    key: "E78.0",
    page: 1,
    polys: [
      [
        [0.1676, 0.6498],
        [0.4646, 0.6498],
        [0.4646, 0.6612],
        [0.1676, 0.6612],
      ],
    ],
  },
  // K76.0 ღვიძლის გაცხიმება (სტეატოზი), რომელიც არ არის შეტანილი
  {
    key: "K76.0",
    page: 1,
    polys: [
      [
        [0.1836, 0.6646],
        [0.7718, 0.6637],
        [0.7718, 0.6755],
        [0.1836, 0.6763],
      ],
    ],
  },
  // E55.9 ვიტამინ D-ს დეფიციტი, დაუზუსტებელი
  {
    key: "E55.9",
    page: 1,
    polys: [
      [
        [0.1818, 0.6806],
        [0.4902, 0.6797],
        [0.4902, 0.6915],
        [0.1818, 0.6923],
      ],
    ],
  },
  // • 195.9 ჰიპოტენზია, დაუზუსტებელი
  {
    key: "I95.9",
    page: 1,
    polys: [
      [
        [0.161, 0.7294],
        [0.4106, 0.7294],
        [0.4106, 0.7407],
        [0.161, 0.7407],
      ],
    ],
  },
  // JXDEJA, PJOEZA (anden, J
  {
    key: "JXDE3A",
    page: 3,
    polys: [
      [
        [0.3068, 0.2811],
        [0.8493, 0.2823],
        [0.8493, 0.2962],
        [0.3068, 0.295],
      ],
      [
        [0.3068, 0.2946],
        [0.5585, 0.3064],
        [0.5573, 0.3173],
        [0.3056, 0.3055],
      ],
    ],
  },
  // BADE1A - ფარისებრი ჯირკვლის ულტრასონოგრაფია
  {
    key: "BADE1A",
    page: 3,
    polys: [
      [
        [0.3062, 0.3059],
        [0.6119, 0.319],
        [0.6113, 0.33],
        [0.305, 0.3169],
      ],
    ],
  },
  // HR.3.6 - თირეოტროპული ჰორმონის განსაზღვრა სისხლში (TSH)
  {
    key: "HR.3.6",
    page: 3,
    polys: [
      [
        [0.3045, 0.3161],
        [0.6772, 0.3236],
        [0.6766, 0.3409],
        [0.3039, 0.3333],
      ],
    ],
  },
  // BL.1.8 - გლიკირებული ჰემოგლობინის განსაზღვრა (HbA1c) NGSP სტ
  {
    key: "BL.1.8",
    page: 3,
    polys: [
      [
        [0.3033, 0.33],
        [0.7674, 0.3329],
        [0.7674, 0.3519],
        [0.3033, 0.3489],
      ],
    ],
  },
  // BL.13 - οδού ο δ (TCHOL, TG LDL-CHOL, HDL-CHOL, VLDL-CHOL, A
  {
    key: "BL.13",
    page: 3,
    polys: [
      [
        [0.3015, 0.3418],
        [0.905, 0.3367],
        [0.9056, 0.359],
        [0.3021, 0.3641],
      ],
    ],
  },
  // HR.1.3. FT4, თიროქსინის თავისუფალი ფრაქციის განსაზღვრა სისხლ
  {
    key: "HR.1.3",
    page: 3,
    polys: [
      [
        [0.3003, 0.3531],
        [0.7187, 0.3569],
        [0.7181, 0.3759],
        [0.2997, 0.3721],
      ],
    ],
  },
  // COMB.6- ηδο (ALT. AST. GGT, ALP, TBIL, OBIL)
  {
    key: "COMB.6",
    page: 3,
    polys: [
      [
        [0.3009, 0.3658],
        [0.727, 0.3586],
        [0.7276, 0.3814],
        [0.3015, 0.3885],
      ],
    ],
  },
  // BL.6 - სისხლის საერთო ანალიზი (CBC-Dim: ESR)
  {
    key: "BL.6",
    page: 3,
    polys: [
      [
        [0.3003, 0.3776],
        [0.5893, 0.3864],
        [0.5881, 0.3974],
        [0.2997, 0.3885],
      ],
    ],
  },
  // HR.6 - ჰომა ინდექსის განსაზღვრა
  {
    key: "HR.6",
    page: 3,
    polys: [
      [
        [0.2991, 0.3898],
        [0.4991, 0.3961],
        [0.4985, 0.4054],
        [0.2985, 0.3991],
      ],
    ],
  },
  // BL.16 - Vitamin D Total, საერთო D ვიტამინის განსაზღვრა სისხლ
  {
    key: "BL.16",
    page: 3,
    polys: [
      [
        [0.2985, 0.3999],
        [0.6855, 0.4067],
        [0.6849, 0.4214],
        [0.2979, 0.4147],
      ],
    ],
  },
];

/** Longest key first, so "BL.16" is never shadowed by "BL.1". */
const KEYS_BY_SPECIFICITY = [...MOCK_ANCHORS].sort(
  (a, b) => b.key.length - a.key.length,
);

export const isMockDocument = (fileNames: string[]): boolean =>
  fileNames.some((name) => name.trim().startsWith(MOCK_DOCUMENT_STEM));

/** Finds the highlight for a displayed value by the code written inside it. */
export const findMockAnchor = (value: string): MockAnchor | undefined => {
  const haystack = value.toUpperCase();
  return KEYS_BY_SPECIFICITY.find((anchor) =>
    haystack.includes(anchor.key.toUpperCase()),
  );
};
