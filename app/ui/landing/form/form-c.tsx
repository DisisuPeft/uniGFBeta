"use client";
import { useFormRequest } from "@/hooks";

export default function FormConversion() {
  const { register, onSubmit, errors, isSubmitting } = useFormRequest();
  return (
    <section className="relative z-10 px-6 pt-10 pb-16">
      <div
        className="
    mx-auto w-full max-w-lg
    rounded-2xl
  "
      >
        <h2 className="text-3xl lg:text-4xl font-semibold text-foreground leading-tight text-balance max-w-2xl mx-auto mb-3 text-center">
          Registrate para obtener mas información
        </h2>
        <form
          onSubmit={onSubmit}
          className="px-6 pb-6 pt-4 grid grid-cols-1 gap-4"
        >
          {/* Nombre */}
          <label className="sr-only text-gray-900" htmlFor="nombre">
            Nombre completo
          </label>
          <input
            id="nombre"
            placeholder="Nombre completo"
            autoComplete="name"
            className="
              w-full rounded-xl
              bg-white/5 text-gray-900 placeholder-gray-900/60
              border border-gray-900
              px-4 py-3
              focus:outline-none focus:ring-2 focus:ring-gray-900/60 focus:border-gray-900/30
              transition
            "
            {...register("nombre", {
              required: "Por favor, escribe tu nombre completo.",
              minLength: {
                value: 3,
                message: "El nombre debe tener al menos 3 caracteres.",
              },
            })}
          />
          {errors.nombre && (
            <span className="text-red-500 text-sm mt-1">
              {errors.nombre.message}
            </span>
          )}
          {/* Email */}
          <label className="sr-only" htmlFor="email">
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="Correo electrónico"
            className="
          w-full rounded-xl
          bg-white/5 text-gray-900 placeholder-gray-900/60
          border border-gray-900
          px-4 py-3
          focus:outline-none focus:ring-2 focus:ring-gray-900/60 focus:border-gray-900/30
          transition
        "
            {...register("correo", {
              required: "Ingresa un correo electrónico válido.",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "El formato del correo no es válido.",
              },
            })}
          />
          {errors.correo && (
            <span className="text-red-500 text-sm mt-1">
              {errors.correo.message}
            </span>
          )}

          {/* Teléfono */}
          <label className="sr-only" htmlFor="telefono">
            Teléfono
          </label>
          <input
            id="telefono"
            inputMode="tel"
            autoComplete="tel"
            placeholder="Teléfono"
            className="
          w-full rounded-xl
          bg-white/5 text-gray-900 placeholder-gray-900/60
          border border-gray-900
          px-4 py-3
          focus:outline-none focus:ring-2 focus:ring-gray-900/60 focus:border-gray-900/30
          transition
        "
            {...register("telefono", {
              required: "El teléfono es obligatorio.",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Ingresa un teléfono válido (10 dígitos).",
              },
            })}
          />
          {errors.telefono && (
            <span className="text-red-500 text-sm mt-1">
              {errors.telefono.message}
            </span>
          )}

          {/* Botón */}
          <button
            type="submit"
            className="cursor-pointer
          mt-2 inline-flex items-center justify-center gap-2
          rounded-xl px-5 py-3
          font-semibold
          text-gray-900
          bg-primary hover:bg-primary
          shadow-[0_10px_30px_-12px_rgba(245,191,66,0.55)]
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-900/40
          transition text-white
        "
            disabled={isSubmitting}
          >
            Enviar solicitud
            {/* <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg> */}
          </button>

          {/* Nota de privacidad */}
          <p className="text-xs text-white/55 mt-1">
            Al enviar aceptas ser contactado con información sobre nuestros
            diplomados.
          </p>
        </form>
      </div>
    </section>
    // <section className="bg-white py-16 text-white text-center">
    //   <div className="max-w-3xl mx-auto px-6">
    //     <h2 className="text-3xl font-bold mb-4 text-black">
    //       Da el siguiente paso en tu formación
    //     </h2>
    //     <p className="mb-8 text-lg opacity-90 text-black">
    //       Déjanos tus datos y un asesor educativo te ayudará a elegir el
    //       diplomado ideal para ti.
    //     </p>
    //     <form
    //       onSubmit={onSubmit}
    //       className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left"
    //     >
    //       {/* NOMBRE */}
    //       <div className="flex flex-col">
    //         <input
    //           type="text"
    //           placeholder="Nombre completo"
    //           className={`p-3 rounded-md text-[#0D1B48] border ${
    //             errors.nombre ? "border-red-500" : "border-transparent"
    //           }`}
    //           {...register("nombre", {
    //             required: "Por favor, escribe tu nombre completo.",
    //             minLength: {
    //               value: 3,
    //               message: "El nombre debe tener al menos 3 caracteres.",
    //             },
    //           })}
    //         />
    //         {errors.nombre && (
    //           <span className="text-red-500 text-sm mt-1">
    //             {errors.nombre.message}
    //           </span>
    //         )}
    //       </div>

    //       {/* CORREO */}
    //       <div className="flex flex-col">
    //         <input
    //           type="email"
    //           placeholder="Correo electrónico"
    //           className={`p-3 rounded-md text-[#0D1B48] border ${
    //             errors.correo ? "border-red-500" : "border-transparent"
    //           }`}
    // {...register("correo", {
    //   required: "Ingresa un correo electrónico válido.",
    //   pattern: {
    //     value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    //     message: "El formato del correo no es válido.",
    //   },
    // })}
    //         />
    // {errors.correo && (
    //   <span className="text-red-500 text-sm mt-1">
    //     {errors.correo.message}
    //   </span>
    // )}
    //       </div>

    //       {/* TELÉFONO */}
    //       <div className="flex flex-col md:col-span-2">
    //         <input
    //           type="tel"
    //           placeholder="Teléfono"
    //           className={`p-3 rounded-md text-[#0D1B48] border ${
    //             errors.telefono ? "border-red-500" : "border-transparent"
    //           }`}
    // {...register("telefono", {
    //   required: "El teléfono es obligatorio.",
    //   pattern: {
    //     value: /^[0-9]{10}$/,
    //     message: "Ingresa un teléfono válido (10 dígitos).",
    //   },
    // })}
    //         />
    // {errors.telefono && (
    //   <span className="text-red-500 text-sm mt-1">
    //     {errors.telefono.message}
    //   </span>
    // )}
    //       </div>

    //       {/* BOTÓN */}
    //       <button
    //         type="submit"
    //         disabled={isSubmitting}
    //         className="bg-white text-[#0D1B48] font-semibold px-6 py-3 rounded-md hover:bg-gray-200 transition md:col-span-2"
    //       >
    //         {isSubmitting ? "Enviando..." : "Enviar solicitud →"}
    //       </button>
    //       <div
    //         className={`mt-4 ${/*data ? "flex justify-center" :*/ "hidden"}`}
    //       >
    //         <div className="w-full md:w-auto max-w-xl mx-auto p-4 bg-green-50 border border-green-200 rounded-2xl shadow-lg flex items-center gap-4 text-green-800 font-medium">
    //           <CheckCircle className="h-6 w-6 flex-shrink-0" />
    //           <div>
    //             <p className="text-lg">¡Solicitud recibida!</p>
    //             {/* <p className="text-sm opacity-90">{data}</p> */}
    //           </div>
    //         </div>
    //       </div>
    //     </form>
    //   </div>
    // </section>
  );
}
