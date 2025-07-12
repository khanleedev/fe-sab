import React from "react";
import { InstagramFilled } from "@ant-design/icons";
import { Instagram } from "lucide-react";
import { useTranslation } from "react-i18next";

export function HeroSection({ scrollToAccounts }) {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-32 min-h-[80vh]">
      {/* Floating 3D Social Media Icons - Exact positioning from image */}
      <div className="absolute inset-0 hidden lg:block">
        {/* Instagram - Top Left - Fixed Design */}
        <div className="absolute top-20 left-20 animate-float z-10">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 shadow-2xl transform rotate-12 hover:rotate-6 transition-transform duration-300 p-1">
            <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center">
              {/* Instagram camera body */}
              <Instagram className="w-10 h-10 text-pink-600" />
            </div>
          </div>
        </div>

        {/* X (Twitter) - Top Center Left - Moved Higher */}
        <div
          className="absolute top-8 left-80 animate-float z-10"
          style={{ animationDelay: "1s" }}
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-800 to-black shadow-2xl transform rotate-6 hover:rotate-12 transition-transform duration-300 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </div>
        </div>

        {/* Facebook - Top Center Right - Moved Higher */}
        <div
          className="absolute top-8 right-80 animate-float z-10"
          style={{ animationDelay: "2s" }}
        >
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 shadow-2xl transform -rotate-6 hover:rotate-6 transition-transform duration-300 flex items-center justify-center">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Blue M Logo - Top Right */}
        <div
          className="absolute top-16 right-20 animate-float z-10"
          style={{ animationDelay: "3s" }}
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 shadow-2xl transform rotate-12 hover:rotate-6 transition-transform duration-300 flex items-center justify-center">
            <span className="text-white font-bold text-2xl">M</span>
          </div>
        </div>

        {/* Twitter - Middle Left */}
        <div
          className="absolute top-1/2 left-4 transform -translate-y-1/2 animate-float z-10"
          style={{ animationDelay: "4s" }}
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-800 to-black shadow-2xl transform -rotate-12 hover:rotate-0 transition-transform duration-300 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </div>
        </div>

        {/* Google - Middle Right Upper */}
        <div
          className="absolute top-1/4 right-4 animate-float z-10"
          style={{ animationDelay: "5s" }}
        >
          <div className="w-20 h-20 rounded-full bg-white shadow-2xl transform rotate-6 hover:rotate-12 transition-transform duration-300 flex items-center justify-center border-2 border-gray-100">
            <svg className="w-10 h-10" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          </div>
        </div>

        {/* YouTube - Middle Right Lower */}
        <div
          className="absolute top-1/2 right-4 mt-20 animate-float z-10"
          style={{ animationDelay: "6s" }}
        >
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-red-500 to-red-700 shadow-2xl transform -rotate-6 hover:rotate-6 transition-transform duration-300 flex items-center justify-center">
            <div className="relative">
              <div className="w-14 h-10 bg-white rounded-lg flex items-center justify-center">
                <div className="w-0 h-0 border-l-[8px] border-l-red-600 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent ml-1"></div>
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp - Bottom Left */}
        <div
          className="absolute bottom-20 left-4 animate-float z-10"
          style={{ animationDelay: "7s" }}
        >
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-green-400 to-green-600 shadow-2xl transform rotate-12 hover:rotate-6 transition-transform duration-300 flex items-center justify-center">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488" />
              </svg>
            </div>
          </div>
        </div>

        {/* Pinterest - Bottom Right */}
        <div
          className="absolute bottom-20 right-4 animate-float z-10"
          style={{ animationDelay: "8s" }}
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-600 to-red-800 shadow-2xl transform rotate-6 hover:rotate-12 transition-transform duration-300 flex items-center justify-center">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-red-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0C5.373 0 0 5.372 0 12s5.373 12 12 12 12-5.372 12-12S18.627 0 12 0zm0 19c-.721 0-1.418-.109-2.073-.312.286-.465.713-1.227.87-1.835l.437-1.664c.229.436.895.804 1.604.804 2.111 0 3.633-1.941 3.633-4.354 0-2.312-1.888-4.042-4.316-4.042-3.021 0-4.625 2.003-4.625 4.137 0 .695.366 1.56.949 1.836.096.045.146.025.168-.07.017-.07.108-.432.142-.563.047-.183.029-.246-.102-.406-.284-.348-.466-.799-.466-1.273 0-1.643 1.222-3.174 3.259-3.174 1.779 0 3.036 1.179 3.036 2.831 0 1.894-.836 3.233-1.896 3.233-.608 0-1.073-.513-.927-1.143.175-.752.514-1.563.514-2.106 0-.485-.258-.891-.793-.891-.63 0-1.136.658-1.136 1.54 0 .562.187.942.187.942s-.637 2.723-.751 3.214c-.068.292-.068.623-.047.897C5.516 18.148 4 15.292 4 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="relative container mx-auto max-w-6xl px-4">
        <div className="text-center">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl leading-tight">
              {t("premium_ad_accounts")}
              <br />
              {t("for_your_success")}
            </h1>

            <p className="mt-8 text-lg leading-relaxed text-gray-600 sm:text-xl max-w-3xl mx-auto">
              {t("unlock_power")}
            </p>

            <div className="mt-12">
              <button
                onClick={scrollToAccounts}
                className="h-14 px-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {t("buy_account_now")}
              </button>
            </div>
          </div>

          {/* Trust indicator */}
          <div className="mt-20">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              {t("trusted_by")}
            </p>
          </div>
        </div>
      </div>

      {/* Custom CSS for floating animation */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(var(--rotation, 0deg));
          }
          50% {
            transform: translateY(-20px) rotate(var(--rotation, 0deg));
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
