export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-slate-950 text-white">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-800 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Margarita AI &nbsp;
          <code className="font-mono font-bold">MVP v0.1</code>
        </p>
      </div>

      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Descubre Margarita
        </h1>
        <p className="text-lg text-gray-400 max-w-xl">
          Tu asistente de viaje hiperlocal potenciado por inteligencia artificial.
        </p>
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:grid-cols-3 lg:text-left gap-4">
        <div className="p-6 rounded-xl border border-gray-800 bg-gray-900/50">
          <h2 className="text-2xl font-semibold mb-2">Playas 🏖️</h2>
          <p className="text-sm text-gray-400">Encuentra los mejores rincones ocultos de la isla.</p>
        </div>
        <div className="p-6 rounded-xl border border-gray-800 bg-gray-900/50">
          <h2 className="text-2xl font-semibold mb-2">Gastronomía 🍤</h2>
          <p className="text-sm text-gray-400">Disfruta la auténtica comida margariteña.</p>
        </div>
        <div className="p-6 rounded-xl border border-gray-800 bg-gray-900/50">
          <h2 className="text-2xl font-semibold mb-2">Logística 🚗</h2>
          <p className="text-sm text-gray-400">Rutas, transporte y recomendaciones en tiempo real.</p>
        </div>
      </div>
    </main>
  );
} 