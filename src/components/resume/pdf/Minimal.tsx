import { Page, View, Text, Link, StyleSheet } from "@react-pdf/renderer";
import { ResumeData } from "@/lib/resume";
import { INK, SUB, splitBullets, contactLine } from "./shared";

const minimal = StyleSheet.create({
    page: { fontFamily: "Helvetica", fontSize: 11.5, color: INK, padding: 50 },
    name: { fontSize: 32, fontFamily: "Helvetica-Bold", letterSpacing: -0.5, marginBottom: 4 },
    role: { fontSize: 13, color: SUB, marginBottom: 5 },
    contact: { fontSize: 10.5, color: "#777777", marginBottom: 30 },
    head: {
        fontSize: 9.5,
        fontFamily: "Helvetica-Bold",
        color: "#999999",
        textTransform: "uppercase",
        letterSpacing: 2.5,
        marginBottom: 12,
        marginTop: 30,
    },
    summary: { fontSize: 12, lineHeight: 2.0, color: SUB },
    itemRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 3 },
    itemTitle: { fontSize: 13, fontFamily: "Helvetica-Bold" },
    itemSub: { fontSize: 11.5, color: SUB },
    dates: { fontSize: 10, color: "#999999" },
    bullet: { fontSize: 11.5, color: SUB, lineHeight: 2.0, marginBottom: 4 },
    block: { marginBottom: 22 },
    skillsLine: { fontSize: 11.5, color: SUB, lineHeight: 2.2 },
});

export const Minimal = ({ d }: { d: ResumeData }) => (
    <Page size="A4" style={minimal.page}>
        <Text style={minimal.name}>{d.personal.fullName || "Your Name"}</Text>
        {d.personal.title ? <Text style={minimal.role}>{d.personal.title}</Text> : null}
        <Text style={minimal.contact}>{contactLine(d.personal)}</Text>

        {d.personal.summary ? (
            <Text style={[minimal.summary, { marginBottom: 4 }]}>{d.personal.summary}</Text>
        ) : null}

        {d.experience.some((e) => e.company || e.role) && (
            <View>
                <Text style={minimal.head}>Experience</Text>
                {d.experience
                    .filter((e) => e.company || e.role)
                    .map((e) => (
                        <View key={e.id} style={minimal.block}>
                            <View style={minimal.itemRow}>
                                <Text style={minimal.itemTitle}>{e.role}</Text>
                                <Text style={minimal.dates}>
                                    {[e.start, e.end].filter(Boolean).join(" – ")}
                                </Text>
                            </View>
                            <Text style={minimal.itemSub}>{e.company}</Text>
                            {splitBullets(e.bullets).map((b, i) => (
                                <Text key={i} style={minimal.bullet}>
                                    — {b}
                                </Text>
                            ))}
                        </View>
                    ))}
            </View>
        )}

        {d.projects.some((p) => p.name) && (
            <View>
                <Text style={minimal.head}>Projects</Text>
                {d.projects
                    .filter((p) => p.name)
                    .map((p) => (
                        <View key={p.id} style={minimal.block}>
                            <View style={minimal.itemRow}>
                                <Text style={minimal.itemTitle}>{p.name}</Text>
                                {p.link ? <Link src={p.link.startsWith("http") ? p.link : `https://${p.link}`} style={minimal.dates}>{p.link}</Link> : null}
                            </View>
                            <Text style={minimal.bullet}>{p.description}</Text>
                        </View>
                    ))}
            </View>
        )}

        {d.education.some((e) => e.school || e.degree) && (
            <View>
                <Text style={minimal.head}>Education</Text>
                {d.education
                    .filter((e) => e.school || e.degree)
                    .map((e) => (
                        <View key={e.id} style={minimal.block}>
                            <View style={minimal.itemRow}>
                                <Text style={minimal.itemTitle}>{e.degree}</Text>
                                <Text style={minimal.dates}>
                                    {[e.start, e.end].filter(Boolean).join(" – ")}
                                </Text>
                            </View>
                            <Text style={minimal.itemSub}>{e.school}</Text>
                            {e.detail ? <Text style={minimal.bullet}>{e.detail}</Text> : null}
                        </View>
                    ))}
            </View>
        )}

        {d.skills.length > 0 && (
            <View>
                <Text style={minimal.head}>Skills</Text>
                <Text style={minimal.skillsLine}>{d.skills.join("   ·   ")}</Text>
            </View>
        )}
    </Page>
);
