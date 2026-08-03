export type Policy = {
  id: string;
  label: string;
  holder: string;
  nationalId: string;
  dob: string;
  number: string;
  plan: string;
};

export type Option = {
  value: string;
  label: string;
  hint?: string;
};

export const POLICIES: Policy[] = [
  {
    id: "pol-1",
    label: "შარაშენიძე არჩილ - VIT 327830/1",
    holder: "შარაშენიძე არჩილ",
    nationalId: "01019087654",
    dob: "1987-04-12",
    number: "327830/1",
    plan: "სტანდარტული პაკეტი",
  },
];

export const GUARANTEE_TYPES: Option[] = [
  { value: "surgery", label: "ქირურგიული ოპერაცია" },
  { value: "medication_sms", label: "მედიკამენტები SMS კოდით" },
  { value: "consultation", label: "ექიმთან კონსულტაცია, გამოკვლევები" },
  { value: "prophylactic", label: "პროფილაქტიკური კვლევები" },
];

export const MEDICAL_SERVICES: Option[] = [
  { value: "doctor_consultation", label: "ექიმთან კონსულტაცია" },
  { value: "lab", label: "ლაბორატორიული კვლევა" },
  { value: "instrumental", label: "ინსტრუმენტული კვლევა" },
  { value: "imaging", label: "ვიზუალური დიაგნოსტიკა (KT, MRI, ექოსკოპია)" },
  { value: "physiotherapy", label: "ფიზიოთერაპია / რეაბილიტაცია" },
];

export const SPECIALISTS: Option[] = [
  { value: "therapist", label: "თერაპევტი" },
  { value: "cardiologist", label: "კარდიოლოგი" },
  { value: "neurologist", label: "ნევროლოგი" },
  { value: "endocrinologist", label: "ენდოკრინოლოგი" },
  { value: "gastroenterologist", label: "გასტროენტეროლოგი" },
  { value: "dermatologist", label: "დერმატოლოგი" },
  { value: "ophthalmologist", label: "ოფთალმოლოგი" },
  { value: "orthopedist", label: "ორთოპედ-ტრავმატოლოგი" },
  { value: "otolaryngologist", label: "ოტორინოლარინგოლოგი" },
  { value: "pediatrician", label: "პედიატრი" },
];

export const CLINICS: Option[] = [
  { value: "reimani", label: "შპს რეიმანი", hint: "თბილისი, ვაჟა-ფშაველას 27" },
  {
    value: "parasitology",
    label:
      "შპს სამედიცინო პარაზიტოლოგიის და ტროპიკული მედიცინის კვლევითი ინსტიტუტი",
    hint: "თბილისი, ქავთარაძის 3",
  },
  {
    value: "aversi",
    label: "შპს ავერსის კლინიკა",
    hint: "თბილისი, ვაჟა-ფშაველას 27ბ",
  },
];

export const MAX_TOTAL_MB = 100;
export const MAX_TOTAL_BYTES = MAX_TOTAL_MB * 1024 * 1024;

export const ACCEPTED_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png"];
