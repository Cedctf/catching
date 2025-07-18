import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, CheckCircle } from 'lucide-react';

const TranslationDemo = () => {
  const { t, i18n } = useTranslation();

  const demoTexts = [
    'hero.title',
    'features.faceRecognition.title',
    'dashboard.title',
    'nav.payNow',
    'common.success'
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <Globe className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Translation Demo</h2>
      </div>
      
      <div className="mb-6">
        <p className="text-gray-600 mb-4">
          Current Language: <span className="font-semibold">{i18n.language}</span>
        </p>
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle className="w-5 h-5" />
          <span>Multilingual support is active!</span>
        </div>
      </div>

      <div className="grid gap-4">
        <h3 className="text-lg font-semibold text-gray-800">Sample Translations:</h3>
        {demoTexts.map((key) => (
          <div key={key} className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">Key: {key}</div>
            <div className="text-lg font-medium text-gray-900">{t(key)}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">How to use:</h4>
        <ul className="text-blue-800 space-y-1 text-sm">
          <li>• Use the language switcher in the navbar to change languages</li>
          <li>• All text will automatically update to the selected language</li>
          <li>• Supports English, Chinese (Simplified), and Bahasa Melayu</li>
          <li>• Language preference is saved in localStorage</li>
        </ul>
      </div>
    </div>
  );
};

export default TranslationDemo;