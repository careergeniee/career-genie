import { Page, View, Text, Link, StyleSheet } from "@react-pdf/renderer";
import { ResumeData } from "@/lib/resume";
import { ACCENT, splitBullets } from "./shared";

const modern = StyleSheet.create({
    page: { flexDirection: "row", fontFamily: "Helvetica", fontSize: 11, color: "#1a1a1a" },
    side: { width: "35%", backgroundColor: "#0f172a", padding: 28 },
    main: { width: "65%", padding: 30, paddingTop: 34 },
    name: { fontSize: 26, fontFamily: "Helvetica-Bold", color: "#ffffff", marginBottom: 5 },
    role: { fontSize: 12, color: "#9fd0ff", marginBottom: 24 },
    sideHead: {
        fontSize: 9.5,
        fontFamily: "Helvetica-Bold",
        color: "#9fd0ff",
        textTransform: "uppercase",
        letterSpacing: 1.5,
        marginBottom: 9,
        marginTop: 24,
    },
    sideText: { fontSize: 10.5, color: "#d8dee9", marginBottom: 8, lineHeight: 1.7 },
    skill: {
        fontSize: 10,
        color: "#ffffff",
        backgroundColor: "#1e3a5f",
        paddingVertical: 5,
        paddingHorizontal: 8,
        borderRadius: 3,
        marginBottom: 6,
    },
    mHead: {
        fontSize: 14,
        fontFamily: "Helvetica-Bold",
        color: ACCENT,
        textTransform: "uppercase",
        letterSpacing: 1.5,
        marginBottom: 10,
        marginTop: 30,
        borderBottomWidth: 1.5,
        borderBottomColor: "#e8edf3",
        paddingBottom: 5,
    },
    summary: { fontSize: 11.5, color: "#444444", lineHeight: 2.0, marginBottom: 8 },
    itemTitle: { fontSize: 13, fontFamily: "Helvetica-Bold", marginBottom: 2 },
    itemSub: { fontSize: 11, color: ACCENT, marginBottom: 4 },
    dates: { fontSize: 10, color: "#888888", marginBottom: 6 },
    bullet: { fontSize: 11, color: "#444444", lineHeight: 2.0, marginBottom: 3 },
    block: { marginBottom: 22 },
});

export const Modern = ({ d }: { d: ResumeData }) => (
    <Page size="A4" style={modern.page}>
        <View style={modern.side}>
            <Text style={modern.name}>{d.personal.fullName || "Your Name"}</Text>
            <Text style={modern.role}>{d.personal.title}</Text>

            <Text style={modern.sideHead}>Contact</Text>
            {d.personal.email ? <Text style={modern.sideText}>{d.personal.email}</Text> : null}
            {d.personal.phone ? <Text style={modern.sideText}>{d.personal.phone}</Text> : null}
            {d.personal.location ? (
                <Text style={modern.sideText}>{d.personal.location}</Text>
            ) : null}
            {d.personal.website ? (
                <Text style={modern.sideText}>{d.personal.website}</Text>
            ) : null}

            {d.skills.length > 0 && (
                <>
                    <Text style={modern.sideHead}>Skills</Text>
                    {d.skills.map((s, i) => (
                        <Text key={i} style={modern.skill}>
                            {s}
                        </Text>
                    ))}
                </>
            )}

            {d.education.some((e) => e.school) && (
                <>
                    <Text style={modern.sideHead}>Education</Text>
                    {d.education
                        .filter((e) => e.school || e.degree)
                        .map((e) => (
                            <View key={e.id} style={{ marginBottom: 8 }}>
                                <Text style={[modern.sideText, { fontFamily: "Helvetica-Bold" }]}>
                                    {e.degree}
                                </Text>
                                <Text style={modern.sideText}>{e.school}</Text>
                                <Text style={[modern.sideText, { color: "#9fb3c8" }]}>
                                    {[e.start, e.end].filter(Boolean).join(" – ")}
                                </Text>
                                {e.detail ? <Text style={modern.sideText}>{e.detail}</Text> : null}
                            </View>
                        ))}
                </>
            )}
        </View>

        <View style={modern.main}>
            {d.personal.summary ? (
                <>
                    <Text style={modern.mHead}>Profile</Text>
                    <Text style={modern.summary}>{d.personal.summary}</Text>
                </>
            ) : null}

            {d.experience.some((e) => e.company || e.role) && (
                <>
                    <Text style={modern.mHead}>Experience</Text>
                    {d.experience
                        .filter((e) => e.company || e.role)
                        .map((e) => (
                            <View key={e.id} style={modern.block}>
                                <Text style={modern.itemTitle}>{e.role}</Text>
                                <Text style={modern.itemSub}>{e.company}</Text>
                                <Text style={modern.dates}>
                                    {[e.start, e.end].filter(Boolean).join(" – ")}
                                </Text>
                                {splitBullets(e.bullets).map((b, i) => (
                                    <Text key={i} style={modern.bullet}>
                                        • {b}
                                    </Text>
                                ))}
                            </View>
                        ))}
                </>
            )}

            {d.projects.some((p) => p.name) && (
                <>
                    <Text style={modern.mHead}>Projects</Text>
                    {d.projects
                        .filter((p) => p.name)
                        .map((p) => (
                            <View key={p.id} style={modern.block}>
                                <Text style={modern.itemTitle}>{p.name}</Text>
                                {p.link ? (
                                    <Link src={p.link.startsWith("http") ? p.link : `https://${p.link}`} style={modern.itemSub}>
                                        {p.link}
                                    </Link>
                                ) : null}
                                <Text style={modern.bullet}>{p.description}</Text>
                            </View>
                        ))}
                </>
            )}
        </View>
    </Page>
);
