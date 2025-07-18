import { useState } from 'react';
import { Loader2, Mail, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function EmailTest() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const testEmail = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/test-email', {
        method: 'POST'
      });
      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data);
      }
    } catch (err) {
      setError({
        error: 'Request failed',
        details: { message: err.message }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Email Configuration Test</h1>
              <p className="text-sm text-gray-500">
                Test will send email to: <span className="font-medium">loyqunjie@gmail.com</span>
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900">Test Information</p>
                  <p className="text-sm text-blue-700 mt-1">
                    This test will send an email to loyqunjie@gmail.com to verify the email configuration.
                    Please check the inbox after running the test.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={testEmail}
              disabled={loading}
              className={`
                w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg
                ${loading ? 'bg-gray-100 text-gray-500' : 'bg-primary text-white hover:bg-primary/90'}
                transition-colors duration-200
              `}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Sending Test Email...
                </>
              ) : (
                <>
                  <Mail className="h-5 w-5" />
                  Send Test Email
                </>
              )}
            </button>

            {/* Results */}
            {(result || error) && (
              <div className={`
                mt-4 p-4 rounded-lg
                ${result ? 'bg-green-50' : 'bg-red-50'}
              `}>
                <div className="flex items-start gap-3">
                  {result ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  )}
                  <div>
                    <p className={`font-medium ${result ? 'text-green-900' : 'text-red-900'}`}>
                      {result ? (
                        <>Email Sent Successfully to loyqunjie@gmail.com</>
                      ) : (
                        'Email Configuration Failed'
                      )}
                    </p>
                    <pre className={`mt-2 text-sm whitespace-pre-wrap font-mono ${
                      result ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {JSON.stringify(result || error, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* Environment Variables Check */}
            <div className="mt-8 space-y-4">
              <h2 className="text-lg font-medium text-gray-900">Configuration Checklist</h2>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  1. Create a <code className="bg-gray-100 px-1 py-0.5 rounded">.env.local</code> file in your project root
                </p>
                <p className="text-sm text-gray-600">
                  2. Add these environment variables:
                </p>
                <pre className="bg-gray-100 p-3 rounded-lg text-sm">
                  {`EMAIL_USER=your.email@gmail.com
EMAIL_PASS=your_app_password`}
                </pre>
                <p className="text-sm text-gray-600">
                  3. For Gmail setup:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 ml-4">
                  <li>Enable 2-Step Verification in your Google Account</li>
                  <li>Generate an App Password:
                    <ul className="list-disc list-inside ml-4">
                      <li>Go to Google Account Security</li>
                      <li>Search for "App Passwords"</li>
                      <li>Select "Mail" and your device</li>
                      <li>Use the generated 16-character password</li>
                    </ul>
                  </li>
                </ul>
                <p className="text-sm text-gray-600">
                  4. Restart your Next.js server after setting up the environment variables
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 