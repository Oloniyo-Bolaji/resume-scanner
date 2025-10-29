export type User = {
  name?: string;
  email: string;
  password: string;
  confirmPassword?: string;
};

export type FormsData = {
  jobTitle: string;
  jobDescription: string;
  experienceLevel: string;
  resumeUrl? : string;
}