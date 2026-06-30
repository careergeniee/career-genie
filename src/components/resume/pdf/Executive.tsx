import { Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { ResumeData } from "@/lib/resume";
import { INK, SUB, NAVY, GOLD, splitBullets } from "./shared";

const executive = StyleSheet.create({
    page: { flexDirection: "row", fontFamily: "Helvetica", fontSize: 11, color: INK },
    side: { width: "42%", backgroundColor: NAVY, padding: 34 },
    main: { width: "58%", padding: 30, paddingTop: 40 },
    name: { fontSize: 24, fontFamily: "Helvetica-Bold", color: "#ffffff", marginBottom: 6 },
    role: { fontSize: 13, color: GOLD, marginBottom: 30 },
    sideHead: { fontSize: 9.5, fontFamily: "Helvetica-Bold", color: GOLD, textTransform: "uppercase", letterSpacing: 2, marginBottom: 10, marginTop: 30 },
    sideText: { fontSize: 10.5, color: "#c8d8e8", marginBottom: 10, lineHeight: 1.8 },
    dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: GOLD, marginRight: 9, marginTop: 4 },
    skillRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 13 },
    skillText: { fontSize: 10.5, color: "#c8d8e8", lineHeight: 1.5 },
    mainHead: { fontSize: 15, fontFamily: "Helvetica-Bold", color: NAVY, textTransform: "uppercase", letterSpacing: 2, marginBottom: 6 },
    goldLine: { height: 2.5, backgroundColor: GOLD, marginBottom: 28, marginTop: 4 },
    summaryLine: { height: 2.5, backgroundColor: GOLD, marginBottom: 38, marginTop: 16 },
    summary: { fontSize: 12.5, color: SUB, lineHeight: 2.2 },
    itemTitle: { fontSize: 13.5, fontFamily: "Helvetica-Bold", marginBottom: 4 },
    itemSub: { fontSize: 12, color: GOLD, fontFamily: "Helvetica-Bold", marginBottom: 5 },
    dates: { fontSize: 10.5, color: "#888888", marginBottom: 12 },
    bullet: { fontSize: 12, color: SUB, lineHeight: 2.2, marginBottom: 4 },
    block: { marginBottom: 30 },
});

export const Executive = ({ d }: { d: ResumeData }) => (
    <Page size="A4" style={executive.page}>
        <View style={executive.side}>
            <Text style={executive.name}>{d.personal.fullName || "Your Name"}</Text>
            {d.personal.title ? <Text style={executive.role}>{d.personal.title}</Text> : null}

            <Text style={executive.sideHead}>Contact</Text>
            {[d.personal.email, d.personal.phone, d.personal.location, d.personal.website]
                .filter(Boolean).map((c, i) => <Text key={i} style={executive.sideText}>{c}</Text>)}

            {d.skills.length > 0 && (
                <>
                    <Text style={executive.sideHead}>Skills</Text>
                    {d.skills.map((s, i) => (
                        <View key={i} style={executive.skillRow}>
                            <View style={executive.dot} />
                            <Text style={executive.skillText}>{s}</Text>
                        </View>
                    ))}
                </>
            )}

            {d.education.some((e) => e.school || e.degree) && (
                <>
                    <Text style={executive.sideHead}>Education</Text>
                    {d.education.filter((e) => e.school || e.degree).map((e) => (
                        <View key={e.id} style={{ marginBottom: 8 }}>
                            <Text style={[executive.sideText, { fontFamily: "Helvetica-Bold", color: "#ffffff" }]}>{e.degree}</Text>
                            <Text style={executive.sideText}>{e.school}</Text>
                            <Text style={[executive.sideText, { color: "#7fa3bf" }]}>{[e.start, e.end].filter(Boolean).join(" – ")}</Text>
                        </View>
                    ))}
                </>
            )}
        </View>

        <View style={executive.main}>
            {d.personal.summary ? (
                <View>
                    <Text style={executive.summary}>{d.personal.summary}</Text>
                    <View style={executive.summaryLine} />
                </View>
            ) : null}

            {d.experience.some((e) => e.company || e.role) && (
                <View style={{ marginTop: 10 }}>
                    <Text style={executive.mainHead}>Experience</Text>
                    <View style={executive.goldLine} />
                    {d.experience.filter((e) => e.company || e.role).map((e) => (
                        <View key={e.id} style={executive.block}>
                            <Text style={executive.itemTitle}>{e.role}</Text>
                            <Text style={executive.itemSub}>{e.company}</Text>
                            <Text style={executive.dates}>{[e.start, e.end].filter(Boolean).join(" – ")}</Text>
                            {splitBullets(e.bullets).map((b, i) => <Text key={i} style={executive.bullet}>• {b}</Text>)}
                        </View>
                    ))}
                </View>
            )}

            {d.projects.some((p) => p.name) && (
                <View style={{ marginTop: 40 }}>
                    <Text style={executive.mainHead}>Projects</Text>
                    <View style={executive.goldLine} />
                    {d.projects.filter((p) => p.name).map((p) => (
                        <View key={p.id} style={executive.block}>
                            <Text style={executive.itemTitle}>{p.name}</Text>
                            {p.link ? <Text style={executive.itemSub}>{p.link}</Text> : null}
                            <Text style={executive.bullet}>{p.description}</Text>
                        </View>
                    ))}
                </View>
            )}
        </View>
    </Page>
);
