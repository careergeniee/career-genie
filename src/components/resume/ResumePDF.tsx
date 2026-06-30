import { Document } from "@react-pdf/renderer";
import { ResumeData, TemplateId } from "@/lib/resume";
import { Modern } from "./pdf/Modern";
import { Classic } from "./pdf/Classic";
import { Minimal } from "./pdf/Minimal";
import { Creative } from "./pdf/Creative";
import { Executive } from "./pdf/Executive";
import { Vibrant } from "./pdf/Vibrant";

export const ResumePDF = ({
    data,
    template,
}: {
    data: ResumeData;
    template: TemplateId;
}) => (
    <Document title={`${data.personal.fullName || "Resume"} - Resume`} author="Career Genie">
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
    </Document>
);
