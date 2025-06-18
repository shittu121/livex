import React from 'react';
import { X, Users, TrendingUp, Star, Award, BarChart3 } from 'lucide-react';

interface RivxScoreExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RivxScoreExplainerModal: React.FC<RivxScoreExplainerModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
              <BarChart3 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              How is my LIVX Score calculated?
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Overview */}
          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              Your LIVX Score is a comprehensive measure of your influence and engagement potential, 
              calculated using a weighted formula that considers multiple key factors of your social media presence.
            </p>
          </div>

          {/* Score Breakdown */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">
              Score Components
            </h3>

            {/* Follower Count */}
            <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg flex-shrink-0">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-slate-900 dark:text-white mb-1">
                  Audience Size (30%)
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Total follower count across all connected platforms, with platform-specific weighting 
                  based on engagement rates and audience quality.
                </p>
              </div>
            </div>

            {/* Engagement Rate */}
            <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex-shrink-0">
                <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-slate-900 dark:text-white mb-1">
                  Engagement Rate (25%)
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Average likes, comments, shares, and saves relative to your follower count. 
                  Higher engagement indicates a more active and interested audience.
                </p>
              </div>
            </div>

            {/* Content Quality */}
            <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg flex-shrink-0">
                <Star className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-slate-900 dark:text-white mb-1">
                  Content Quality (20%)
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Consistency of posting, content originality, visual quality, and alignment 
                  with your stated niche or expertise areas.
                </p>
              </div>
            </div>

            {/* Growth Trend */}
            <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg flex-shrink-0">
                <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-slate-900 dark:text-white mb-1">
                  Growth Momentum (15%)
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Recent follower growth rate and engagement trends over the past 90 days. 
                  Upward trends boost your score significantly.
                </p>
              </div>
            </div>

            {/* Brand Alignment */}
            <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <div className="p-2 bg-rose-100 dark:bg-rose-900 rounded-lg flex-shrink-0">
                <Award className="h-5 w-5 text-rose-600 dark:text-rose-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-slate-900 dark:text-white mb-1">
                  Brand Safety & Professionalism (10%)
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Profile completeness, bio quality, professional presentation, and absence 
                  of controversial content that might deter brand partnerships.
                </p>
              </div>
            </div>
          </div>

          {/* Tier Information */}
          <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">
              LIVX Tier System
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3 bg-slate-900 text-white rounded-lg">
                <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
                <span className="font-medium">Bronze: 0-249</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-amber-600 text-white rounded-lg">
                <div className="w-3 h-3 bg-amber-300 rounded-full"></div>
                <span className="font-medium">Silver: 250-499</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-yellow-500 text-white rounded-lg">
                <div className="w-3 h-3 bg-yellow-200 rounded-full"></div>
                <span className="font-medium">Gold: 500-749</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-emerald-600 text-white rounded-lg">
                <div className="w-3 h-3 bg-emerald-300 rounded-full"></div>
                <span className="font-medium">Platinum: 750-1000</span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Note:</strong> Your LIVX Score is updated weekly based on your latest social media data. 
              To improve your score, focus on consistent posting, authentic engagement, and growing your audience organically.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={onClose}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};

export default RivxScoreExplainerModal;