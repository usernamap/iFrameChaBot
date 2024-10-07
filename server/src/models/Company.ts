// src/models/Company.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface ICompany extends Document {
    name: string;
    industry: string;
    description: string;
    location: string;
    website: string;
    contact: {
        phone: string;
        email: string;
    };
    services: string[];
    targetAudience: string[];
    competitors: string[];
    brandVoice: string;
    frequentlyAskedQuestions: string[];
    values: string[];
    socialMediaLinks: {
        facebook: string;
        twitter: string;
        linkedin: string;
        instagram: string;
    };
    policies: {
        privacyPolicy: string;
        returnPolicy: string;
        termsOfService: string;
    };
    testimonials: string[];
    team: string[];
    locationDetails: {
        mainOffice: {
            address: string;
            hours: string[];
        };
        branches: string[];
    };
    otherInfo: {
        companyHistory: string;
        companyCulture: string;
        additionalInfo: string;
    };
    // Ajoutez d'autres champs si nécessaire
}

const CompanySchema: Schema = new Schema({
    name: { type: String, required: true },
    industry: { type: String },
    description: { type: String },
    location: { type: String },
    website: { type: String },
    contact: {
        phone: { type: String },
        email: { type: String },
    },
    services: [{ type: String }],
    targetAudience: [{ type: String }],
    competitors: [{ type: String }],
    brandVoice: { type: String },
    frequentlyAskedQuestions: [{ type: String }],
    values: [{ type: String }],
    socialMediaLinks: {
        facebook: { type: String },
        twitter: { type: String },
        linkedin: { type: String },
        instagram: { type: String },
    },
    policies: {
        privacyPolicy: { type: String },
        returnPolicy: { type: String },
        termsOfService: { type: String },
    },
    testimonials: [{ type: String }],
    team: [{ type: String }],
    locationDetails: {
        mainOffice: {
            address: { type: String },
            hours: [{ type: String }],
        },
        branches: [{ type: String }],
    },
    otherInfo: {
        companyHistory: { type: String },
        companyCulture: { type: String },
        additionalInfo: { type: String },
    },
}, { timestamps: true });

export default mongoose.model<ICompany>('Company', CompanySchema);
