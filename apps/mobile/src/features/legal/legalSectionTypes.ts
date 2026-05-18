export type LegalSection = {
  title: string;
  paragraphs: string[];
};

export type LegalDocOpts = {
  appName: string;
  publisher: string;
  supportEmail: string;
  privacyEmail: string;
  phone: string;
  website: string;
  deleteAccountUrl: string;
};
