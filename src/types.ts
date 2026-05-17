export interface Student {
  id: string;
  name: string;
  grade?: string;
  teacherId: string;
}

export interface GradeContent {
  grade: string;
  units: Unit[];
}

export interface Unit {
  title: string;
  types: ProblemType[];
}

export interface ProblemType {
  id: string;
  title: string;
}

export enum ProgressStatus {
  NONE = 0,
  CORRECT_1 = 1,
  CORRECT_2 = 2,
  CORRECT_3_STAR = 3,
  WRONG_1 = -1,
  WRONG_2_SKULL = -2
}

export interface Progress {
  studentId: string;
  teacherId: string;
  typeId: string;
  status: ProgressStatus;
  streak: number;
}

export interface Problem {
  id?: string;
  typeId: string;
  question: string;
  answer: string;
  explanation: string;
}

export interface TestPaper {
  id: string;
  title: string;
  studentId: string;
  teacherId: string;
  problems: Problem[];
  numPerPage: number;
  createdAt: any;
}
