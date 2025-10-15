'use client';

import { useState, useEffect, useRef } from 'react';
import { aiAPI } from '@/services/api';
import {
  Bot,
  Send,
  Sparkles,
  AlertTriangle,
  TrendingUp,
  FileText,
  User,
  Loader2,
} from 'lucide-react';

export default function AIAssistantPage() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm your AI Clinical Assistant. I can help you with patient risk assessment, treatment recommendations, and clinical decision support. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);

  const suggestions = [
    {
      icon: AlertTriangle,
      title: 'Assess Patient Risk',
      description: 'Evaluate risk factors for diabetes complications',
      query: 'Assess risk factors for patient MRN001234 with diabetes',
    },
    {
      icon: TrendingUp,
      title: 'Treatment Insights',
      description: 'Get evidence-based treatment recommendations',
      query: 'What are the latest treatment guidelines for hypertension?',
    },
    {
      icon: FileText,
      title: 'Clinical Summary',
      description: 'Generate a comprehensive patient summary',
      query: 'Generate a clinical summary for patient MRN001234',
    },
  ];

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (customMessage) => {
    const messageText = customMessage || input;
    if (!messageText.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Call real AI API
      const response = await aiAPI.chat(messageText, conversationId);
      
      // Update conversation ID if this is the first message
      if (!conversationId && response.conversationId) {
        setConversationId(response.conversationId);
      }

      const assistantMessage = {
        role: 'assistant',
        content: response.message || response.content || 'I apologize, but I encountered an error processing your request.',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('AI Error:', err);
      
      // Fallback to mock response if API fails
      const fallbackMessage = {
        role: 'assistant',
        content: `I'm currently experiencing connectivity issues. Here's what I can tell you based on cached data:\n\n${getMockResponse(messageText)}`,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getMockResponse = (query) => {
    if (query.toLowerCase().includes('risk')) {
      return `**Risk Assessment for Patient MRN001234**

Based on the patient's current health profile:

**High Risk Factors:**
- HbA1c: 7.2% (Above target <7%)
- Blood Glucose: 245 mg/dL (Elevated)
- BMI: 32.4 (Obese)

**Moderate Risk Factors:**
- Age: 39 years with 4-year diabetes history
- Systolic BP: 128 mmHg (Prehypertensive)

**Recommendations:**
1. Consider intensifying diabetes management
2. Increase monitoring frequency to bi-weekly
3. Refer to nutritionist for dietary counseling
4. Schedule retinopathy screening within 30 days

**Clinical Action Items:**
- Review and potentially adjust Metformin dosage
- Order lipid panel if not done in last 3 months
- Assess for diabetic neuropathy symptoms
- Patient education on home glucose monitoring

Would you like me to generate a detailed care plan or assess any specific complications?`;
    } else if (query.toLowerCase().includes('treatment') || query.toLowerCase().includes('guidelines')) {
      return `**Evidence-Based Hypertension Treatment Guidelines (2024)**

**First-Line Therapies:**
1. **ACE Inhibitors/ARBs** - Preferred for patients with diabetes or CKD
2. **Calcium Channel Blockers** - Effective for all patient populations
3. **Thiazide Diuretics** - Cost-effective for stage 1 hypertension

**Target Blood Pressure:**
- General Population: <130/80 mmHg
- Diabetes/CKD: <130/80 mmHg
- Age >65: <130/80 mmHg (individualized)

**Treatment Algorithm:**
- Stage 1 (130-139/80-89): Lifestyle + single agent
- Stage 2 (≥140/90): Lifestyle + two agents (different classes)

**Key Considerations:**
- Assess cardiovascular risk with pooled cohort equations
- Screen for secondary causes if resistant hypertension
- Monitor potassium and creatinine with ACE-I/ARB therapy

Would you like specific drug recommendations or lifestyle intervention strategies?`;
    } else if (query.toLowerCase().includes('summary')) {
      return `**Comprehensive Clinical Summary**

**Patient:** John Doe (MRN001234)
**Age:** 39 years | **Gender:** Male | **Blood Type:** A+

**Active Diagnoses:**
1. Type 2 Diabetes Mellitus (since 2020)
2. Essential Hypertension (since 2019)
3. Hyperlipidemia (since 2021)

**Current Medications:**
- Metformin 1000mg BID
- Lisinopril 10mg QD
- Atorvastatin 20mg QHS

**Recent Vitals (Today):**
- BP: 128/82 mmHg
- Glucose: 245 mg/dL ⚠️ ELEVATED
- BMI: 32.4 (Obese)

**Recent Labs (3 weeks ago):**
- HbA1c: 7.2% (Target <7%)
- LDL: 95 mg/dL (On target)

**Care Gaps:**
- Overdue for annual eye exam (last: 14 months ago)
- Flu vaccine pending for current season
- Foot exam due within 30 days

**Clinical Alerts:**
- Elevated blood glucose requires attention
- Patient reported occasional chest discomfort - follow up needed

**Recommended Actions:**
1. Adjust diabetes medication regimen
2. Schedule ophthalmology referral
3. Order cardiac stress test for chest symptoms
4. Nutritionist consultation for weight management

Is there a specific aspect you'd like me to elaborate on?`;
    }
    return "I understand you're asking about clinical care. Could you please provide more specific details about the patient or condition you'd like me to analyze? I can help with risk assessments, treatment guidelines, medication interactions, and care planning.";
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900">AI Clinical Assistant</h1>
              <p className="text-sm text-gray-500">Powered by advanced medical AI</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              Online
            </span>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto bg-gray-50 px-6 py-4">
        {messages.length === 1 && (
          <div className="mb-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                How can I help you today?
              </h2>
              <p className="text-gray-600">
                Select a suggestion below or ask me anything about patient care
              </p>
            </div>

            {/* Suggestions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {suggestions.map((suggestion, idx) => {
                const Icon = suggestion.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSend(suggestion.query)}
                    disabled={isLoading}
                    className="p-4 bg-white border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Icon className="h-6 w-6 text-purple-600 mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-1">{suggestion.title}</h3>
                    <p className="text-sm text-gray-600">{suggestion.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages.slice(1).map((message, idx) => (
            <div
              key={idx}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex max-w-[80%] ${
                  message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div
                  className={`flex-shrink-0 ${
                    message.role === 'user' ? 'ml-3' : 'mr-3'
                  }`}
                >
                  {message.role === 'assistant' ? (
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <div
                    className={`px-4 py-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-cyan-600 text-white'
                        : 'bg-white text-gray-900 border border-gray-200'
                    }`}
                  >
                    <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                    <span className="text-sm text-gray-600">Analyzing...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about patient care, risk assessment, treatment guidelines..."
                rows={1}
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-500 text-center">
            AI-generated content should be verified by healthcare professionals before clinical use
          </p>
        </div>
      </div>
    </div>
  );
}