// src/interfaces/CompanyInfo.ts

export interface ContactInfo {
    phone: string;
    email: string;
}

export interface SocialMediaLinks {
    facebook: string;
    twitter: string;
    linkedin: string;
    instagram: string;
}

export interface Policies {
    privacyPolicy: string;
    returnPolicy: string;
    termsOfService: string;
}

export interface LocationDetails {
    mainOffice: {
        address: string;
        hours: string[];
    };
    branches: any[];
}

export interface OtherInfo {
    companyHistory: string;
    companyCulture: string;
    additionalInfo: string;
}

export interface CompanyInfo {
    name: string;
    industry: string;
    description: string;
    location: string;
    website: string;
    contact: ContactInfo;
    services: string[];
    targetAudience: string[];
    competitors: string[];
    brandVoice: string;
    frequentlyAskedQuestions: string[];
    values: string[];
    socialMediaLinks: SocialMediaLinks;
    policies: Policies;
    testimonials: any[];
    team: any[];
    locationDetails: LocationDetails;
    otherInfo: OtherInfo;
}
