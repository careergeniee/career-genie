import { Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { ResumeData } from "@/lib/resume";
import { INK, SUB, PURPLE, PURPLE_LIGHT, splitBullets, contactLine } from "./shared";

const creative = StyleSheet.create({
    page: { fontFamily: "Helvetica", fontSize: 11, color: INK },
    header: { backgroundColor: PURPLE, padding: 40, paddingBottom: 34 },
    name: { fontSize: 32, fontFamily: "Helvetica-Bold", color: "#ffffff", marginBottom: 6 },
    role: { fontSize: 14, color: "#c4b5fd", marginBottom: 2 },
    contact: { fontSize: 10.5, color: "#ddd6fe", marginTop: 10 },
    body: { padding: 36 },
    secLabel: { fontSize: 15, fontFamily: "Helvetica-Bold", color: PURPLE, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6, marginTop: 28 },
    secLine: { height: 3, backgroundColor: PURPLE, width: 34, marginBottom: 14 },
    summary: { fontSize: 12, color: SUB, lineHeight: 2.0 },
    itemTitle: { fontSize: 13.5, fontFamily: "Helvetica-Bold", marginBottom: 3 },
    itemSub: { fontSize: 12, color: PURPLE, fontFamily: "Helvetica-Bold", marginBottom: 4 },
    dates: { fontSize: 10, color: "#888888", marginBottom: 8 },
    bullet: { fontSize: 12, color: SUB, lineHeight: 2.0, marginBottom: 4 },
    block: { marginBottom: 20 },
    skillPill: { fontSize: 10.5, color: PURPLE, backgroundColor: PURPLE_LIGHT, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 14, marginRight: 7, marginBottom: 7 },
    skillsRow: { flexDirection: "row", flexWrap: "wrap" },
});

export const Creative = ({ d }: { d: ResumeData }) => (
    <Page size="A4" style={{ fontFamily: "Helvetica", fontSize: 10, color: INK }}>
        <View style={creative.header}>
            <Text style={creative.name}>{d.personal.fullName || "Your Name"}</Text>
            {d.personal.title ? <Text style={creative.role}>{d.personal.title}</Text> : null}
            <Text style={creative.contact}>{contactLine(d.personal)}</Text>
        </View>
        <View style={creative.body}>
            {d.personal.summary ? (
                <View>
                    <Text style={creative.secLabel}>About Me</Text>
                    <View style={creative.secLine} />
                    <Text style={creative.summary}>{d.personal.summary}</Text>
                </View>
            ) : null}
            {d.experience.some((e) => e.company || e.role) && (
                <View>
                    <Text style={creative.secLabel}>Experience</Text>
                    <View style={creative.secLine} />
                    {d.experience.filter((e) => e.company || e.role).map((e) => (
                        <View key={e.id} style={creative.block}>
                            <Text style={creative.itemTitle}>{e.role}</Text>
                            <Text style={creative.itemSub}>{e.company}</Text>
                            <Text style={creative.dates}>{[e.start, e.end].filter(Boolean).join(" – ")}</Text>
                            {splitBullets(e.bullets).map((b, i) => <Text key={i} style={creative.bullet}>• {b}</Text>)}
                        </View>
                    ))}
                </View>
            )}
            {d.education.some((e) => e.school || e.degree) && (
                <View>
                    <Text style={creative.secLabel}>Education</Text>
                    <View style={creative.secLine} />
                    {d.education.filter((e) => e.school || e.degree).map((e) => (
                        <View key={e.id} style={creative.block}>
                            <Text style={creative.itemTitle}>{e.degree}</Text>
                            <Text style={creative.itemSub}>{e.school}</Text>
                            <Text style={creative.dates}>{[e.start, e.end].filter(Boolean).join(" – ")}</Text>
                            {e.detail ? <Text style={creative.bullet}>{e.detail}</Text> : null}
                        </View>
                    ))}
                </View>
            )}
            {d.projects.some((p) => p.name) && (
                <View>
                    <Text style={creative.secLabel}>Projects</Text>
                    <View style={creative.secLine} />
                    {d.projects.filter((p) => p.name).map((p) => (
                        <View key={p.id} style={creative.block}>
                            <Text style={creative.itemTitle}>{p.name}</Text>
                            {p.link ? <Text style={creative.itemSub}>{p.link}</Text> : null}
                            <Text style={creative.bullet}>{p.description}</Text>
                        </View>
                    ))}
                </View>
            )}
            {d.skills.length > 0 && (
                <View>
                    <Text style={creative.secLabel}>Skills</Text>
                    <View style={creative.secLine} />
                    <View style={creative.skillsRow}>
                        {d.skills.map((s, i) => <Text key={i} style={creative.skillPill}>{s}</Text>)}
                    </View>
                </View>
            )}
        </View>
    </Page>
);
