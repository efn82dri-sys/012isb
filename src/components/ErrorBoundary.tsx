import React from 'react';
import { Language } from '../types/isb';

interface ErrorBoundaryProps {
  lang?: Language;
  onResetHome?: () => void;
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ISB UI Boundary caught error:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      const isFa = (this.props.lang || 'fa') === 'fa';
      return (
        <div className="min-h-[60vh] flex items-center justify-center px-6 py-24 bg-[#FAFBFD]">
          <div className="max-w-md w-full bg-white border border-black/10 rounded-xl p-8 text-center space-y-4">
            <div className="text-xs font-mono-tech font-bold text-[#223981]">
              {isFa ? 'خطای نمایش صفحه' : 'VIEW RECOVERY'}
            </div>
            <h1 className="text-xl font-bold text-[#141923]">
              {isFa ? 'بروز خطای غیرمنتظره در نمایش بخش' : 'Something went wrong loading this view'}
            </h1>
            <p className="text-xs text-[#525C6E] leading-relaxed">
              {isFa
                ? 'می‌توانید صفحه را مجدداً بارگذاری کنید یا به صفحه اصلی گروه ISB بازگردید.'
                : 'You can reload the view or return to the ISB Group homepage.'}
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  this.setState({ hasError: false });
                  this.props.onResetHome?.();
                }}
                className="px-4 py-2 rounded-md bg-[#223981] text-white text-xs font-semibold cursor-pointer"
              >
                {isFa ? 'بازگشت به صفحه اصلی' : 'Return Home'}
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-4 py-2 rounded-md border border-black/15 text-xs font-semibold text-[#141923] cursor-pointer"
              >
                {isFa ? 'بارگذاری مجدد' : 'Reload Page'}
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
