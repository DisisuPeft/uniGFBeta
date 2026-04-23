import LoginForm from "../components/form/login-form";

export default function Page() {
  return (
    <div className="w-full max-w-[95%] sm:max-w-[600px] lg:max-w-[800px]">
      <div className="bg-white rounded-2xl shadow-2xl px-6 py-8 sm:px-12 sm:py-10 lg:px-16 lg:py-12">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div
            className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full mb-3 sm:mb-4"
            style={{
              background:
                "linear-gradient(135deg, #0f1f65ff 0%, #699cdbff 100%)",
            }}
          >
            <svg
              className="w-6 h-6 sm:w-8 sm:h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
            Bienvenido
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Inicia sesión en tu cuenta
          </p>
        </div>

        {/* Form */}
        <LoginForm />
      </div>
    </div>
  );
}
