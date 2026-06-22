import {
    Document,
    Page,
    View,
    Text,
    Link,
    StyleSheet,
} from "@react-pdf/renderer";
import { ResumeData, TemplateId } from "@/lib/resume";

/* Resumes print on white paper, so these styles are intentionally light —
   they do NOT use the dark dashboard theme. Only built-in PDF fonts are used
   (Helvetica / Times-Roman) so generation never depends on a network fetch. */

const ACCENT = "#1f6feb"; // modern accent
const INK = "#1a1a1a";
const SUB = "#444444";
const LINE = "#d0d0d0";

const splitBullets = (s: string) =>
    s
        .split("\n")
        .map((b) => b.trim())
        .filter(Boolean);

/* ---------------------------------------------------------------- MODERN */
const modern = StyleSheet.create({
    page: { flexDirection: "row", fontFamily: "Helvetica", fontSize: 10, color: INK },
    side: { width: "32%", backgroundColor: "#0f172a", color: "#ffffff", padding: 22 },
    main: { width: "68%", padding: 24 },
    name: { fontSize: 22, fontFamily: "Helvetica-Bold", marginBottom: 2 },
    role: { fontSize: 11, color: "#9fd0ff", marginBottom: 16 },
    sideHead: {
        fontSize: 10,
        fontFamily: "Helvetica-Bold",
        color: "#9fd0ff",
        textTransform: "uppercase",
        letterSpacing: 1,
        marginBottom: 6,
        marginTop: 14,
    },
    sideText: { fontSize: 9, color: "#d8dee9", marginBottom: 4, lineHeight: 1.4 },
    skill: {
        fontSize: 9,
        color: "#ffffff",
        backgroundColor: "#1e3a5f",
        paddingVertical: 3,
        paddingHorizontal: 6,
        borderRadius: 3,
        marginBottom: 4,
    },
    mHead: {
        fontSize: 12,
        fontFamily: "Helvetica-Bold",
        color: ACCENT,
        textTransform: "uppercase",
        letterSpacing: 1,
        marginBottom: 6,
        marginTop: 14,
    },
    summary: { fontSize: 10, color: SUB, lineHeight: 1.5, marginBottom: 4 },
    itemTitle: { fontSize: 11, fontFamily: "Helvetica-Bold" },
    itemSub: { fontSize: 9.5, color: ACCENT, marginBottom: 3 },
    dates: { fontSize: 8.5, color: "#888888" },
    bullet: { fontSize: 9.5, color: SUB, lineHeight: 1.45, marginBottom: 2 },
    block: { marginBottom: 12 },
});

/* --------------------------------------------------------------- CLASSIC */
const classic = StyleSheet.create({
    page: { fontFamily: "Times-Roman", fontSize: 11, color: INK, padding: 40 },
    name: { fontSize: 24, fontFamily: "Times-Bold", textAlign: "center" },
    role: { fontSize: 12, textAlign: "center", color: SUB, marginBottom: 4 },
    contact: { fontSize: 9.5, textAlign: "center", color: SUB, marginBottom: 14 },
    head: {
        fontSize: 12,
        fontFamily: "Times-Bold",
        textTransform: "uppercase",
        letterSpacing: 1,
        borderBottomWidth: 1,
        borderBottomColor: INK,
        paddingBottom: 2,
        marginBottom: 6,
        marginTop: 12,
    },
    summary: { fontSize: 10.5, lineHeight: 1.5, color: SUB },
    itemRow: { flexDirection: "row", justifyContent: "space-between" },
    itemTitle: { fontSize: 11, fontFamily: "Times-Bold" },
    itemSub: { fontSize: 10.5, fontFamily: "Times-Italic", color: SUB },
    dates: { fontSize: 9.5, color: SUB },
    bullet: { fontSize: 10, color: SUB, lineHeight: 1.45, marginLeft: 10, marginBottom: 1.5 },
    block: { marginBottom: 9 },
    skills: { fontSize: 10.5, lineHeight: 1.5 },
});

/* --------------------------------------------------------------- MINIMAL */
const minimal = StyleSheet.create({
    page: { fontFamily: "Helvetica", fontSize: 10, color: INK, padding: 46 },
    name: { fontSize: 26, fontFamily: "Helvetica-Bold", letterSpacing: -0.5 },
    role: { fontSize: 11, color: SUB, marginBottom: 3 },
    contact: { fontSize: 9, color: "#777777", marginBottom: 22 },
    head: {
        fontSize: 9,
        fontFamily: "Helvetica-Bold",
        color: "#999999",
        textTransform: "uppercase",
        letterSpacing: 2,
        marginBottom: 8,
        marginTop: 18,
    },
    summary: { fontSize: 10.5, lineHeight: 1.6, color: SUB },
    itemRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 1 },
    itemTitle: { fontSize: 11, fontFamily: "Helvetica-Bold" },
    itemSub: { fontSize: 10, color: SUB },
    dates: { fontSize: 9, color: "#999999" },
    bullet: { fontSize: 9.5, color: SUB, lineHeight: 1.5, marginBottom: 2 },
    block: { marginBottom: 13 },
    skillsLine: { fontSize: 10, color: SUB, lineHeight: 1.7 },
});

const contactLine = (p: ResumeData["personal"]) =>
    [p.email, p.phone, p.location, p.website].filter(Boolean).join("  •  ");

/* ---- MODERN doc ---- */
const Modern = ({ d }: { d: ResumeData }) => (
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

/* ---- CLASSIC doc ---- */
const Classic = ({ d }: { d: ResumeData }) => (
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

/* ---- MINIMAL doc ---- */
const Minimal = ({ d }: { d: ResumeData }) => (
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
                                {p.link ? <Text style={minimal.dates}>{p.link}</Text> : null}
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
        ) : (
            <Minimal d={data} />
        )}
    </Document>
);
