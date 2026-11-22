/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Strict Design.md semantic palette
        canvas: '#F8FAFC',
        well: '#F1F5F9',
        border: {
          subtle: '#E2E8F0',
          strong: '#CBD5E1'
        },
        navy: {
          dark: '#1E293B',
          hover: '#334155',
          deep: '#0F172A'
        },
        cobalt: {
          DEFAULT: '#3B82F6',
          hover: '#2563EB',
          active: '#1D4ED8',
          tint: '#EFF6FF'
        },
        sky: {
          DEFAULT: '#0EA5E9',
          tint: '#F0F9FF',
          dark: '#075985'
        },
        slate: {
          neutral: '#64748B',
          muted: '#94A3B8'
        },
        status: {
          success: '#10B981',
          successBg: '#ECFDF5',
          successText: '#065F46',
          warning: '#F59E0B',
          warningBg: '#FFFBEB',
          warningText: '#92400E',
          error: '#EF4444',
          errorBg: '#FEF2F2',
          errorText: '#991B1B'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
      },
      borderRadius: {
        sm: '0.125rem',
        DEFAULT: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem'
      }
    },
  },
  plugins: [],
}
