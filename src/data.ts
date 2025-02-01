import { FormControl } from "@angular/forms";

export type Person = {
  name: string;
  height: number;
  age: number; // just a number
  department: 'Engineering' | 'Marketing' | 'Sales';
};

export type PersonForm = {
  [K in keyof Person]: FormControl<Person[K]>;
};

export const datalist: Person[] = [
  {
    name: 'Alice',
    height: 165,
    age: 25,
    department: 'Engineering',
  },
  {
    name: 'Bob',
    height: 175,
    age: 30,
    department: 'Marketing',
  },
  {
    name: 'Charlie',
    height: 180,
    age: 35,
    department: 'Engineering',
  },
  {
    name: 'David',
    height: 160,
    age: 28,
    department: 'Sales',
  },
  {
    name: 'Eve',
    height: 170,
    age: 22,
    department: 'Marketing',
  },
  {
    name: 'Frank',
    height: 185,
    age: 45,
    department: 'Engineering',
  },
  {
    name: 'Grace',
    height: 155,
    age: 32,
    department: 'Sales',
  },
  {
    name: 'Hank',
    height: 165,
    age: 29,
    department: 'Marketing',
  },
  {
    name: 'Ivy',
    height: 160,
    age: 27,
    department: 'Engineering',
  },
  {
    name: 'Jack',
    height: 175,
    age: 40,
    department: 'Sales',
  },
];
