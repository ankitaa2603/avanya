export type Persona = {
  id: "shanti" | "ramesh" | "ananya";
  name: string;
  age: number;
  tagline: string;
  greetingHi: string;
  greetingEn: string;
  accountNo: string;
  balance: number;
};

export const PERSONAS: Persona[] = [
  {
    id: "shanti",
    name: "Shanti Devi",
    age: 62,
    tagline: "Digitally hesitant • Pensioner",
    greetingHi: "Namaste, Shanti ji",
    greetingEn: "Hello, Shanti",
    accountNo: "•••• 4521",
    balance: 184250.5,
  },
  {
    id: "ramesh",
    name: "Ramesh Kumar",
    age: 45,
    tagline: "Small business owner • Kirana store",
    greetingHi: "Namaste, Ramesh ji",
    greetingEn: "Hello, Ramesh",
    accountNo: "•••• 7812",
    balance: 472180.0,
  },
  {
    id: "ananya",
    name: "Ananya Sharma",
    age: 24,
    tagline: "Young customer • Salary account",
    greetingHi: "Hi, Ananya",
    greetingEn: "Hi, Ananya",
    accountNo: "•••• 9043",
    balance: 56890.0,
  },
];

export function getPersona(id: string | null | undefined): Persona | null {
  return PERSONAS.find((p) => p.id === id) ?? null;
}