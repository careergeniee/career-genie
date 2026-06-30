import { Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { ResumeData } from "@/lib/resume";
import { INK, SUB, TEAL, CORAL, splitBullets } from "./shared";

const vibrant = StyleSheet.create({
    page: { flexDirection: "column", fontFamily: "Helvetica", fontSize: 11, color: INK },
    header: { backgroundColor: TEAL, padding: 36, paddingBottom: 30 },
    name: { fontSize: 32, fontFamily: "Helvetica-Bold", color: "#ffffff", marginBottom: 6 },
    role: { fontSize: 14, color: "#99f6e4", marginBottom: 2 },
    contact: { fontSize: 10.5, color: "#ccfbf1", marginTop: 10 },
    body: { flexDirection: "row", flex: 1 },
    main: { flex: 1, padding: 30 },
    aside: { width: "29%", backgroundColor: "#f0fdf9", padding: 24, borderLeftWidth: 1.5, borderLeftColor: "#ccfbf1" },
    asideHead: { fontSize: 9.5, fontFamily: "Helvetica-Bold", color: TEAL, textTransform: "uppercase", letterSpacing: 2, marginBottom: 10, marginTop: 22 },
    asideText: { fontSize: 11, color: "#374151", marginBottom: 8, lineHeight: 1.7 },
    skillBadge: { fontSize: 10.5, color: "#0d7a70", backgroundColor: "#ccfbf1", paddingVertical: 6, paddingHorizontal: 9, borderRadius: 4, marginBottom: 7 },
    secLabel: { fontSize: 15, fontFamily: "Helvetica-Bold", color: CORAL, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6, marginTop: 28 },
    secLine: { height: 1, backgroundColor: "#fed7aa", marginBottom: 14 },
    summary: { fontSize: 12, color: SUB, lineHeight: 2.1, marginBottom: 8 },
    itemTitle: { fontSize: 13.5, fontFamily: "Helvetica-Bold", marginBottom: 4 },
    itemSub: { fontSize: 12, color: CORAL, fontFamily: "Helvetica-Bold", marginBottom: 5 },
    dates: { fontSize: 10.5, color: "#888888", marginBottom: 10 },
    bullet: { fontSize: 12, color: SUB, lineHeight: 2.1, marginBottom: 4 },
    block: { marginBottom: 22 },
});

export const Vibrant = ({ d }: { d: ResumeData }) => (
    <Page size="A4" style={{ fontFamily: "Helvetica", fontSize: 10, color: INK }}>
        <View style={vibrant.header}>
            <Text style={vibrant.name}>{d.personal.fullName || "Your Name"}</Text>
            {d.personal.title ? <Text style={vibrant.role}>{d.personal.title}</Text> : null}
            <Text style={vibrant.contact}>{[d.personal.email, d.personal.phone, d.personal.location, d.personal.website].filter(Boolean).join("  •  ")}</Text>
        </View>

        <View style={vibrant.body}>
            <View style={vibrant.main}>
                {d.personal.summary ? (
                    <Text style={[vibrant.summary, { marginBottom: 12 }]}>{d.personal.summary}</Text>
                ) : null}
                {d.experience.some((e) => e.company || e.role) && (
                    <View>
                        <Text style={vibrant.secLabel}>Experience</Text>
                        <View style={vibrant.secLine} />
                        {d.experience.filter((e) => e.company || e.role).map((e) => (
                            <View key={e.id} style={vibrant.block}>
                                <Text style={vibrant.itemTitle}>{e.role}</Text>
                                <Text style={vibrant.itemSub}>{e.company}</Text>
                                <Text style={vibrant.dates}>{[e.start, e.end].filter(Boolean).join(" – ")}</Text>
                                {splitBullets(e.bullets).map((b, i) => <Text key={i} style={vibrant.bullet}>• {b}</Text>)}
                            </View>
                        ))}
                    </View>
                )}
                {d.projects.some((p) => p.name) && (
                    <View>
                        <Text style={vibrant.secLabel}>Projects</Text>
                        <View style={vibrant.secLine} />
                        {d.projects.filter((p) => p.name).map((p) => (
                            <View key={p.id} style={vibrant.block}>
                                <Text style={vibrant.itemTitle}>{p.name}</Text>
                                {p.link ? <Text style={[vibrant.dates, { color: TEAL }]}>{p.link}</Text> : null}
                                <Text style={vibrant.bullet}>{p.description}</Text>
                            </View>
                        ))}
                    </View>
                )}
            </View>

            <View style={vibrant.aside}>
                {d.skills.length > 0 && (
                    <View>
                        <Text style={vibrant.asideHead}>Skills</Text>
                        {d.skills.map((s, i) => <Text key={i} style={vibrant.skillBadge}>{s}</Text>)}
                    </View>
                )}
                {d.education.some((e) => e.school || e.degree) && (
                    <View>
                        <Text style={vibrant.asideHead}>Education</Text>
                        {d.education.filter((e) => e.school || e.degree).map((e) => (
                            <View key={e.id} style={{ marginBottom: 8 }}>
                                <Text style={[vibrant.asideText, { fontFamily: "Helvetica-Bold" }]}>{e.degree}</Text>
                                <Text style={vibrant.asideText}>{e.school}</Text>
                                <Text style={[vibrant.asideText, { color: "#888888" }]}>{[e.start, e.end].filter(Boolean).join(" – ")}</Text>
                            </View>
                        ))}
                    </View>
                )}
            </View>
        </View>
    </Page>
);
