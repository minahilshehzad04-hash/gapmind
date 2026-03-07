import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import UploadForm from "@/components/dashboard/UploadForm";

export default async function UploadPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/login");
    }

    return (
        <div className="flex-1 w-full max-w-3xl mx-auto px-6 py-20">
            <div className="text-center mb-12 space-y-4">
                <h1 className="font-outfit text-4xl font-bold">New Analysis</h1>
                <p className="text-slate-400">Upload your latest resume and specify your target role.</p>
            </div>

            <UploadForm />
        </div>
    );
}
