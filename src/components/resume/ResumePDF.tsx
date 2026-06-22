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
const PURPLE = "#4f46e5";
const PURPLE_LIGHT = "#ede9fe";
const NAVY = "#0a2540";
const GOLD = "#c9a227";
const TEAL = "#0d9488";
const CORAL = "#ea580c";

const splitBullets = (s: string) =>
    s
        .split("\n")
        .map((b) => b.trim())
        .filter(Boolean);

/* ---------------------------------------------------------------- MODERN */
const modern = StyleSheet.create({
    page: { flexDirection: "row", fontFamily: "Helvetica", fontSize: 11, color: INK },
    side: { width: "35%", backgroundColor: "#0f172a", padding: 26 },
    main: { width: "65%", padding: 28, paddingTop: 30 },
    name: { fontSize: 26, fontFamily: "Helvetica-Bold", color: "#ffffff", marginBottom: 4 },
    role: { fontSize: 12, color: "#9fd0ff", marginBottom: 20 },
    sideHead: {
        fontSize: 9.5,
        fontFamily: "Helvetica-Bold",
        color: "#9fd0ff",
        textTransform: "uppercase",
        letterSpacing: 1.5,
        marginBottom: 7,
        marginTop: 18,
    },
    sideText: { fontSize: 10, color: "#d8dee9", marginBottom: 5, lineHeight: 1.5 },
    skill: {
        fontSize: 9.5,
        color: "#ffffff",
        backgroundColor: "#1e3a5f",
        paddingVertical: 4,
        paddingHorizontal: 7,
        borderRadius: 3,
        marginBottom: 5,
    },
    mHead: {
        fontSize: 13,
        fontFamily: "Helvetica-Bold",
        color: ACCENT,
        textTransform: "uppercase",
        letterSpacing: 1.5,
        marginBottom: 8,
        marginTop: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#e8edf3",
        paddingBottom: 4,
    },
    summary: { fontSize: 11, color: SUB, lineHeight: 1.6, marginBottom: 6 },
    itemTitle: { fontSize: 12.5, fontFamily: "Helvetica-Bold", marginBottom: 1 },
    itemSub: { fontSize: 10.5, color: ACCENT, marginBottom: 3 },
    dates: { fontSize: 9.5, color: "#888888", marginBottom: 4 },
    bullet: { fontSize: 10.5, color: SUB, lineHeight: 1.5, marginBottom: 3 },
    block: { marginBottom: 14 },
});

/* --------------------------------------------------------------- CLASSIC */
const classic = StyleSheet.create({
    page: { fontFamily: "Times-Roman", fontSize: 11.5, color: INK, padding: 44 },
    name: { fontSize: 30, fontFamily: "Times-Bold", textAlign: "center", marginBottom: 4 },
    role: { fontSize: 13, textAlign: "center", color: SUB, marginBottom: 5 },
    contact: { fontSize: 10, textAlign: "center", color: SUB, marginBottom: 16 },
    head: {
        fontSize: 13,
        fontFamily: "Times-Bold",
        textTransform: "uppercase",
        letterSpacing: 1.5,
        borderBottomWidth: 1.5,
        borderBottomColor: INK,
        paddingBottom: 3,
        marginBottom: 8,
        marginTop: 18,
    },
    summary: { fontSize: 11, lineHeight: 1.6, color: SUB },
    itemRow: { flexDirection: "row", justifyContent: "space-between" },
    itemTitle: { fontSize: 12, fontFamily: "Times-Bold" },
    itemSub: { fontSize: 11, fontFamily: "Times-Italic", color: SUB },
    dates: { fontSize: 10, color: SUB },
    bullet: { fontSize: 10.5, color: SUB, lineHeight: 1.5, marginLeft: 12, marginBottom: 2 },
    block: { marginBottom: 11 },
    skills: { fontSize: 11, lineHeight: 1.6 },
});

/* --------------------------------------------------------------- MINIMAL */
const minimal = StyleSheet.create({
    page: { fontFamily: "Helvetica", fontSize: 11, color: INK, padding: 48 },
    name: { fontSize: 32, fontFamily: "Helvetica-Bold", letterSpacing: -0.5, marginBottom: 3 },
    role: { fontSize: 13, color: SUB, marginBottom: 4 },
    contact: { fontSize: 10, color: "#777777", marginBottom: 26 },
    head: {
        fontSize: 9.5,
        fontFamily: "Helvetica-Bold",
        color: "#999999",
        textTransform: "uppercase",
        letterSpacing: 2.5,
        marginBottom: 9,
        marginTop: 22,
    },
    summary: { fontSize: 11.5, lineHeight: 1.7, color: SUB },
    itemRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
    itemTitle: { fontSize: 12.5, fontFamily: "Helvetica-Bold" },
    itemSub: { fontSize: 11, color: SUB },
    dates: { fontSize: 9.5, color: "#999999" },
    bullet: { fontSize: 10.5, color: SUB, lineHeight: 1.6, marginBottom: 3 },
    block: { marginBottom: 16 },
    skillsLine: { fontSize: 11, color: SUB, lineHeight: 1.8 },
});

/* -------------------------------------------------------------- CREATIVE */
const creative = StyleSheet.create({
    page: { fontFamily: "Helvetica", fontSize: 11, color: INK },
    header: { backgroundColor: PURPLE, padding: 38, paddingBottom: 32 },
    name: { fontSize: 32, fontFamily: "Helvetica-Bold", color: "#ffffff", marginBottom: 5 },
    role: { fontSize: 13, color: "#c4b5fd", marginBottom: 1 },
    contact: { fontSize: 10, color: "#ddd6fe", marginTop: 8 },
    body: { padding: 34 },
    secLabel: { fontSize: 14, fontFamily: "Helvetica-Bold", color: PURPLE, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 5, marginTop: 20 },
    secLine: { height: 3, backgroundColor: PURPLE, width: 32, marginBottom: 10 },
    summary: { fontSize: 11.5, color: SUB, lineHeight: 1.7 },
    itemTitle: { fontSize: 13, fontFamily: "Helvetica-Bold", marginBottom: 2 },
    itemSub: { fontSize: 11, color: PURPLE, fontFamily: "Helvetica-Bold", marginBottom: 2 },
    dates: { fontSize: 9.5, color: "#888888", marginBottom: 5 },
    bullet: { fontSize: 11, color: SUB, lineHeight: 1.5, marginBottom: 3 },
    block: { marginBottom: 14 },
    skillPill: { fontSize: 10, color: PURPLE, backgroundColor: PURPLE_LIGHT, paddingVertical: 5, paddingHorizontal: 11, borderRadius: 14, marginRight: 6, marginBottom: 6 },
    skillsRow: { flexDirection: "row", flexWrap: "wrap" },
});

/* -------------------------------------------------------------- EXECUTIVE */
const executive = StyleSheet.create({
    page: { flexDirection: "row", fontFamily: "Helvetica", fontSize: 11, color: INK },
    side: { width: "38%", backgroundColor: NAVY, padding: 30 },
    main: { width: "62%", padding: 30, paddingTop: 34 },
    name: { fontSize: 28, fontFamily: "Helvetica-Bold", color: "#ffffff", marginBottom: 5 },
    role: { fontSize: 13, color: GOLD, marginBottom: 24 },
    sideHead: { fontSize: 9.5, fontFamily: "Helvetica-Bold", color: GOLD, textTransform: "uppercase", letterSpacing: 2, marginBottom: 7, marginTop: 20 },
    sideText: { fontSize: 10.5, color: "#c8d8e8", marginBottom: 6, lineHeight: 1.5 },
    dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: GOLD, marginRight: 9, marginTop: 4 },
    skillRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 7 },
    skillText: { fontSize: 10.5, color: "#c8d8e8", lineHeight: 1.4 },
    mainHead: { fontSize: 15, fontFamily: "Helvetica-Bold", color: NAVY, textTransform: "uppercase", letterSpacing: 2, marginBottom: 5 },
    goldLine: { height: 2.5, backgroundColor: GOLD, marginBottom: 16, marginTop: 3 },
    summaryLine: { height: 2.5, backgroundColor: GOLD, marginBottom: 22, marginTop: 12 },
    summary: { fontSize: 11.5, color: SUB, lineHeight: 1.7 },
    itemTitle: { fontSize: 13.5, fontFamily: "Helvetica-Bold", marginBottom: 2 },
    itemSub: { fontSize: 11.5, color: GOLD, fontFamily: "Helvetica-Bold", marginBottom: 3 },
    dates: { fontSize: 10, color: "#888888", marginBottom: 6 },
    bullet: { fontSize: 11, color: SUB, lineHeight: 1.6, marginBottom: 4 },
    block: { marginBottom: 18 },
});

/* -------------------------------------------------------------- VIBRANT */
const vibrant = StyleSheet.create({
    page: { flexDirection: "column", fontFamily: "Helvetica", fontSize: 11, color: INK },
    header: { backgroundColor: TEAL, padding: 34, paddingBottom: 28 },
    name: { fontSize: 32, fontFamily: "Helvetica-Bold", color: "#ffffff", marginBottom: 5 },
    role: { fontSize: 13, color: "#99f6e4", marginBottom: 1 },
    contact: { fontSize: 10, color: "#ccfbf1", marginTop: 8 },
    body: { flexDirection: "row", flex: 1 },
    main: { flex: 1, padding: 28 },
    aside: { width: "29%", backgroundColor: "#f0fdf9", padding: 22, borderLeftWidth: 1.5, borderLeftColor: "#ccfbf1" },
    asideHead: { fontSize: 9.5, fontFamily: "Helvetica-Bold", color: TEAL, textTransform: "uppercase", letterSpacing: 2, marginBottom: 8, marginTop: 16 },
    asideText: { fontSize: 10.5, color: "#374151", marginBottom: 5, lineHeight: 1.5 },
    skillBadge: { fontSize: 10, color: "#0d7a70", backgroundColor: "#ccfbf1", paddingVertical: 5, paddingHorizontal: 8, borderRadius: 4, marginBottom: 5 },
    secLabel: { fontSize: 14, fontFamily: "Helvetica-Bold", color: CORAL, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 5, marginTop: 20 },
    secLine: { height: 1, backgroundColor: "#fed7aa", marginBottom: 10 },
    summary: { fontSize: 11.5, color: SUB, lineHeight: 1.7, marginBottom: 6 },
    itemTitle: { fontSize: 13.5, fontFamily: "Helvetica-Bold", marginBottom: 2 },
    itemSub: { fontSize: 11.5, color: CORAL, fontFamily: "Helvetica-Bold", marginBottom: 3 },
    dates: { fontSize: 10, color: "#888888", marginBottom: 6 },
    bullet: { fontSize: 11, color: SUB, lineHeight: 1.6, marginBottom: 3 },
    block: { marginBottom: 14 },
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

/* ---- CREATIVE doc ---- */
const Creative = ({ d }: { d: ResumeData }) => (
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

/* ---- EXECUTIVE doc ---- */
const Executive = ({ d }: { d: ResumeData }) => (
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
                <View style={{ marginBottom: 14 }}>
                    <Text style={executive.summary}>{d.personal.summary}</Text>
                    <View style={executive.summaryLine} />
                </View>
            ) : null}

            {d.experience.some((e) => e.company || e.role) && (
                <View>
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
                <View>
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

/* ---- VIBRANT doc ---- */
const Vibrant = ({ d }: { d: ResumeData }) => (
    <Page size="A4" style={{ fontFamily: "Helvetica", fontSize: 10, color: INK }}>
        <View style={vibrant.header}>
            <Text style={vibrant.name}>{d.personal.fullName || "Your Name"}</Text>
            {d.personal.title ? <Text style={vibrant.role}>{d.personal.title}</Text> : null}
            <Text style={vibrant.contact}>{contactLine(d.personal)}</Text>
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
