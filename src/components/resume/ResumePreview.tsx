import { memo } from "react";
import { ResumeData, TemplateId } from "@/lib/resume";
import { Modern } from "./preview/Modern";
import { Classic } from "./preview/Classic";
import { Minimal } from "./preview/Minimal";
import { Creative } from "./preview/Creative";
import { Executive } from "./preview/Executive";
import { Vibrant } from "./preview/Vibrant";

export const ResumePreview = memo(function ResumePreview({
    data,
    template,
}: {
    data: ResumeData;
    template: TemplateId;
}) {
    return (
        <div className="bg-white text-black w-full shadow-xl rounded-sm overflow-hidden min-h-[1100px]">
            {template === "modern" ? (
                <Modern d={data} />
            ) : template === "classic" ? (
                <Classic d={data} />
            ) : template === "minimal" ? (
                <Minimal d={data} />
            ) : template === "creative" ? (
                <Creative d={data} />
            ) : template === "executive" ? (
                <Executive d={data} />
            ) : (
                <Vibrant d={data} />
            )}
        </div>
    );
});
