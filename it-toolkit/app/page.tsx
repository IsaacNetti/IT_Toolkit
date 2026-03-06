import Link from "next/link";
import { PageWrapper } from "@/components/ui";

export default function Home() {
  return (
    <PageWrapper>
      <h1 className="text-4xl font-bold text-white mb-2">IT Toolkit</h1>
      <p className="text-xl text-slate-400 mb-12">A collection of useful utilities for developers and IT professionals</p>

      {/* Tools Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Call Notes & Troubleshooting */}
        <Link href="/calls">
          <div className="h-full p-6 bg-slate-800 border-2 border-slate-700 rounded-lg hover:border-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/20 cursor-pointer group">
            <h2 className="text-xl font-bold text-white mb-2 group-hover:text-blue-500">Call Notes & Troubleshooting</h2>
            <p className="text-slate-400 text-sm">Track multiple IT calls with notes and troubleshooting to-dos</p>
          </div>
        </Link>
        {/* Password Generator */}
        <Link href="/password-generator">
          <div className="h-full p-6 bg-slate-800 border-2 border-slate-700 rounded-lg hover:border-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/20 cursor-pointer group">
            <h2 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400">Password Generator</h2>
            <p className="text-slate-400 text-sm">Create strong, unique passwords with customizable options</p>
          </div>
        </Link>

        {/* Commands Reference */}
        <Link href="/commands">
          <div className="h-full p-6 bg-slate-800 border-2 border-slate-700 rounded-lg hover:border-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/20 cursor-pointer group">
            <h2 className="text-xl font-bold text-white mb-2 group-hover:text-blue-500">Commands Reference</h2>
            <p className="text-slate-400 text-sm">Quick access to essential shortcuts and commands for all platforms</p>
          </div>
        </Link>
      </div>
    </PageWrapper>
  );
}
