"use client";
import { ResumeForm } from "components/ResumeForm";
import { Resume } from "components/Resume";

export default function Create() {
  return (
    <main className="relative h-full w-full overflow-hidden bg-gray-50">
      <div className="grid grid-cols-3 md:grid-cols-6">
        <div className="col-span-3">
          <ResumeForm />
        </div>
        <div className="col-span-3">
          <Resume />
        </div>
      </div>
    </main>
  );
}
