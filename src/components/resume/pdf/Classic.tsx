import { Page, View, Text, Link, StyleSheet } from "@react-pdf/renderer";
import { ResumeData } from "@/lib/resume";
import { INK, SUB, splitBullets, contactLine } from "./shared";

const classic = StyleSheet.create({
    page: { fontFamily: "Times-Roman", fontSize: 12, color: INK, padding: 46 },
    name: { fontSize: 30, fontFamily: "Times-Bold", textAlign: "center", marginBottom: 5 },
    role: { fontSize: 13, textAlign: "center", color: SUB, marginBottom: 6 },
    contact: { fontSize: 10.5, textAlign: "center", color: SUB, marginBottom: 20 },
    head: {
        fontSize: 14,
        fontFamily: "Times-Bold",
        textTransform: "uppercase",
        letterSpacing: 1.5,
        borderBottomWidth: 1.5,
        borderBottomColor: INK,
        paddingBottom: 4,
        marginBottom: 12,
        marginTop: 28,
    },
    summary: { fontSize: 12, lineHeight: 1.9, color: SUB },
    itemRow: { flexDirection: "row", justifyContent: "space-between" },
    itemTitle: { fontSize: 13, fontFamily: "Times-Bold" },
    itemSub: { fontSize: 12, fontFamily: "Times-Italic", color: SUB },
    dates: { fontSize: 10.5, color: SUB },
    bullet: { fontSize: 11.5, color: SUB, lineHeight: 2.0, marginLeft: 14, marginBottom: 3 },
    block: { marginBottom: 18 },
    skills: { fontSize: 12, lineHeight: 2.0 },
});

export const Classic = ({ d }: { d: ResumeData }) => (
    <Page size="A4" style={classic.page}>
        <Text style={classic.name}>{d.personal.fullName || "Your Name"}</Text>
        {d.personal.title ? <Text style={classic.role}>{d.personal.title}</Text> : null}
        <Text style={classic.contact}>{contactLine(d.personal)}</Text>

        {d.personal.summary ? (
            <View>
                <Text style={classic.head}>Summary</Text>
                <Text style={classic.summary}>{d.personal.summary}</Text>
            </View>
        ) : null}

        {d.experience.some((e) => e.company || e.role) && (
            <View>
                <Text style={classic.head}>Experience</Text>
                {d.experience
                    .filter((e) => e.company || e.role)
                    .map((e) => (
                        <View key={e.id} style={classic.block}>
                            <View style={classic.itemRow}>
                                <Text style={classic.itemTitle}>
                                    {e.role}
                                    {e.company ? `, ${e.company}` : ""}
                                </Text>
                                <Text style={classic.dates}>
                                    {[e.start, e.end].filter(Boolean).join(" – ")}
                                </Text>
                            </View>
                            {splitBullets(e.bullets).map((b, i) => (
                                <Text key={i} style={classic.bullet}>
                                    • {b}
                                </Text>
                            ))}
                        </View>
                    ))}
            </View>
        )}

        {d.education.some((e) => e.school || e.degree) && (
            <View>
                <Text style={classic.head}>Education</Text>
                {d.education
                    .filter((e) => e.school || e.degree)
                    .map((e) => (
                        <View key={e.id} style={classic.block}>
                            <View style={classic.itemRow}>
                                <Text style={classic.itemTitle}>{e.degree}</Text>
                                <Text style={classic.dates}>
                                    {[e.start, e.end].filter(Boolean).join(" – ")}
                                </Text>
                            </View>
                            <Text style={classic.itemSub}>{e.school}</Text>
                            {e.detail ? <Text style={classic.bullet}>{e.detail}</Text> : null}
                        </View>
                    ))}
            </View>
        )}

        {d.projects.some((p) => p.name) && (
            <View>
                <Text style={classic.head}>Projects</Text>
                {d.projects
                    .filter((p) => p.name)
                    .map((p) => (
                        <View key={p.id} style={classic.block}>
                            <Text style={classic.itemTitle}>{p.name}</Text>
                            <Text style={classic.bullet}>{p.description}</Text>
                            {p.link ? (
                                <Link src={p.link.startsWith("http") ? p.link : `https://${p.link}`} style={classic.bullet}>
                                    {p.link}
                                </Link>
                            ) : null}
                        </View>
                    ))}
            </View>
        )}

        {d.skills.length > 0 && (
            <View>
                <Text style={classic.head}>Skills</Text>
                <Text style={classic.skills}>{d.skills.join("  •  ")}</Text>
            </View>
        )}
    </Page>
);
