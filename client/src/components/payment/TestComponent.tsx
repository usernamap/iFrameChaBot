import React from 'react';
import LimitedTestChatbot from './LimitedTestChatbot';
import { ChatbotConfig } from '@/types';

interface TestComponentProps {
    chatbotConfig: ChatbotConfig;
    companyInfo: any;
    onNextStep: () => void;
}

const TestComponent: React.FC<TestComponentProps> = ({
    chatbotConfig,
    companyInfo,
    onNextStep
}) => {
    return (
        <div className="">
            <LimitedTestChatbot
                chatbotConfig={chatbotConfig}
                companyInfo={companyInfo}
                onNextStep={onNextStep}
            />
        </div>
    );
};

export default TestComponent;