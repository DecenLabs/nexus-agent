import React from 'react';
import { Search, TrendingUp, Coins, FileText } from 'lucide-react';

interface SampleQuestionsProps {
  handleSend: (question: string) => void;
}

const SampleQuestions: React.FC<SampleQuestionsProps> = ({ handleSend }) => {
  const actions = [
    { icon: TrendingUp, label: 'Trending', description: 'Search the trending tokens' },
    { icon: Coins, label: 'Stake', description: 'Stake Sol' },
    { icon: Search, label: 'Trade', description: 'Swap on Jupiter' },
    { icon: FileText, label: 'Knowledge', description: 'Get developer docs for protocols' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mt-8">
      {actions.map((action, index) => {
        const Icon = action.icon;
        return (
          <button
            key={index}
            onClick={() => handleSend(action.description)}
            className="flex items-start p-5 rounded-xl border border-orange-100 bg-white hover:bg-orange-50 transition-all duration-200 shadow-lg shadow-orange-100/10 hover:shadow-orange-200/20 group"
          >
            <div className="p-2 m-4 rounded-lg bg-orange-100 text-orange-600 group-hover:bg-orange-200 transition-colors mb-3">
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-900 mb-1">{action.label}</span>
              <span className="text-sm text-gray-600">{action.description}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default SampleQuestions;
