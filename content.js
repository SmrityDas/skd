/* ============================================================
   RSV LAB — SITE CONTENT
   ------------------------------------------------------------
   ✏️ THIS IS THE ONLY FILE YOU EDIT FOR CONTENT.

   RULES:
   • Change text between " " — keep quotes and commas.
   • Add a card → paste a new { ... } block inside cards: [ ].
   • Remove a card → delete its { ... } block.
   • Empty arrays [] hide their section automatically.
   • Colours: var(--primary-purple|blue|orange|cyan|green|red)
              or any hex like "#E11D48".
   • Save on GitHub → Cloudflare redeploys in ~30 seconds.
   ============================================================ */

const SITE = {

  /* ========== BASIC INFO ========== */
  labName:      "RSV Lab",
  shortName:    "RSV Lab",
  tagline:      "ML-assisted AMR Surveillance & AST Analysis",
  taglinePart1: "Machine Learning (ML) assisted Antimicrobial Resistance",
  taglinePart2: "Surveillance & Data Science",
  description:  "An integrated computational framework for microbiology, antimicrobial susceptibility testing (AST), and bioinformatics research.",
  founderName:  "Kamol Das",
  year:         "2026",

  /* Canonical URL — used in meta tags + structured data */
  canonicalUrl: "https://rsv8lab-github-io.pages.dev/",

  /* Logo shown in header next to wordmark. Leave "" for text-only. */
  logo: "rsvlab-logo.png",

  /* ========== SOCIAL / CONTACT LINKS ==========
     Set any field to "" to hide its icon. */
  github:   "https://github.com/rsv8lab",
  twitter:  "https://x.com/KDKamol",
  linkedin: "https://www.linkedin.com/in/kamol-das-7a4b0b1b7/",
  youtube:  "https://www.youtube.com/@RSVLab",
  facebook: "https://www.facebook.com/profile.php?id=100090153347276",
  email:    "kamol.mbio@gmail.com",
  orcid:    "https://orcid.org/0009-0004-2253-7527",
  phone:    "01775510351",
  location: "Department of Microbiology, University of Chittagong · Ramakrishna Mission, Hathazari, Chittagong, Bangladesh",

  /* ========== PARTNER LAB ========== */
  partnerLabUrl:  "https://ecobioremediation.pages.dev/",
  partnerLabText: "Eco-Bio Lab",

  /* ========== NAV ========== */
  nav: [
    { label: "About",        href: "#about" },
    { label: "Publications", href: "#publications" },
    { label: "Projects",     href: "#projects" },
    { label: "Founder",      href: "#founder" },
    { label: "Contact",      href: "#contact" },
  ],

  /* ========== HERO BADGE ========== */
  heroBadge: "Founded by Kamol Das · Microbiology, University of Chittagong",

  /* ========== ABOUT ========== */
  about: {
    title:    "About RSV Lab",
    subtitle: "We bridge the gap between traditional microbiology and modern computational analysis, focusing on antimicrobial resistance surveillance and CLSI/EUCAST-compliant susceptibility testing.",
    cards: [
      {
        icon:  "fa-microscope",
        color: "var(--primary-blue)",
        title: "Research & Development",
        text:  "Clinical microbiology, antimicrobial resistance (AMR) surveillance, and drug discovery, grounded in CLSI M100 and EUCAST breakpoint standards."
      },
      {
        icon:  "fa-laptop-code",
        color: "var(--primary-orange)",
        title: "Bioinformatics & Data Analysis",
        text:  "Python and R-based tools for AST data structuring, MDR/XDR/PDR classification, and machine learning applications in AMR data."
      },
      {
        icon:  "fa-flask",
        color: "var(--primary-purple)",
        title: "Biotechnology & Pharma",
        text:  "Applying scientific knowledge to real-world challenges in pharmaceuticals, quality control, and industrial biotechnology."
      },
    ],
  },

  /* ========== PUBLICATIONS ========== */
  publications: {
    title:    "Recent Research & Publications",
    subtitle: "Our latest contributions to the scientific community, available via open-access repositories.",
    items: [
      {
        title:   "An Integrated Computational Framework for Antimicrobial Susceptibility Testing",
        authors: "Kamol Das et al.",
        journal: "Zenodo Preprint, 2026",
        doi:     "https://doi.org/10.5281/zenodo.20589848"
      },
      {
        title:   "Machine Learning Analysis Reports for Microbial Data",
        authors: "Kamol Das et al.",
        journal: "Zenodo Dataset, 2026",
        doi:     "https://doi.org/10.5281/zenodo.21534293"
      },
      {
        title:   "RSV Lab Official Logo",
        authors: "Kamol Das",
        journal: "Zenodo, 2026",
        doi:     "https://doi.org/10.5281/zenodo.19209980"
      },
    ],
  },

  /* ========== PROJECTS ========== */
  projects: {
    title:    "Our Projects",
    subtitle: "Open-source tools and research repositories developed by RSV Lab and its founder.",
    filters: [
      { key: "all",      label: "All" },
      { key: "lab",      label: "RSV Lab Repos" },
      { key: "personal", label: "Founder's Repos" },
    ],
    cards: [
      {
        category: "lab",
        icon:  "fa-robot",
        color: "var(--primary-blue)",
        title: "RSVLab-ASTLearn",
        text:  "AST machine learning toolkit for predicting antimicrobial susceptibility.",
        link:  "https://github.com/rsv8lab/RSVLab-ASTLearn"
      },
      {
        category: "lab",
        icon:  "fa-dna",
        color: "var(--primary-orange)",
        title: "RSVLab-Bioinformatics",
        text:  "DNA/RNA sequence analysis tools for genomic research.",
        link:  "https://github.com/rsv8lab/RSVLab-Bioinformatics"
      },
      {
        category: "lab",
        icon:  "fa-database",
        color: "var(--primary-purple)",
        title: "RSVLab-DNAStore",
        text:  "RSV algorithm DNA-computing framework for data storage.",
        link:  "https://github.com/rsv8lab/RSVLab-DNAStore"
      },
      {
        category: "lab",
        icon:  "fa-bacteria",
        color: "var(--primary-blue)",
        title: "RSVLab-Microbiology",
        text:  "CLSI, EUCAST, MPN, drug development & discovery, and AST reference databases.",
        link:  "https://github.com/rsv8lab/RSVLab-Microbiology"
      },
      {
        category: "personal",
        icon:  "fa-flask",
        color: "var(--primary-orange)",
        title: "AST-Tool",
        text:  "Python workflow for 2×2, 3×3, and 4×4 AST matrix agreement analysis — a CLSI-compliant method validation tool.",
        link:  "https://github.com/KamolDas/AST-Tool"
      },
      {
        category: "personal",
        icon:  "fa-code",
        color: "var(--primary-purple)",
        title: "DNA-sequence-for-data-store",
        text:  "DNA-as-string and Unicode-text-based approaches for data storage.",
        link:  "https://github.com/KamolDas/DNA-sequence-for-data-store"
      },
      {
        category: "personal",
        icon:  "fa-terminal",
        color: "var(--primary-blue)",
        title: "C-basic",
        text:  "Basic C programming practice and examples.",
        link:  "https://github.com/KamolDas/C-basic"
      },
    ],
  },

  /* ========== TEAM / FOUNDER ========== */
  team: {
    title:  "Meet the Founder",
    name:   "Kamol Das",
    role:   "Founder & Principal Investigator",
    bio:    "MS student, Department of Microbiology, University of Chittagong, Bangladesh. Works at the intersection of AMR surveillance, clinical microbiology, and computational tools for AST analysis.",
    avatar: "https://github.com/KamolDas.png",
    orcid:  "https://orcid.org/0009-0004-2253-7527",
    members: [],   // add collaborators here when ready
  },

  /* ========== CONTACT ========== */
  contact: {
    title:    "Contact RSV Lab",
    subtitle: "Get in touch with RSV Lab for collaborations, research inquiries, or general questions.",
    cards: [
      {
        icon:  "fa-map-marker-alt",
        color: "var(--primary-blue)",
        title: "Location",
        text:  "University of Chittagong<br>Chittagong, Bangladesh"
      },
      {
        icon:  "fa-phone",
        color: "var(--primary-purple)",
        title: "Phone",
        text:  "01775-510351<br>01867-771598"
      },
      {
        icon:  "fa-envelope",
        color: "var(--primary-orange)",
        title: "Email",
        text:  "kamol.mbio@gmail.com"
      },
    ],
    socials: [
      {
        label: "Facebook",
        icon:  "fab fa-facebook",
        url:   "https://www.facebook.com/profile.php?id=100090153347276",
        color: "#1877F2",
        text:  "Follow RSV Lab for updates, news, and community posts.",
        cta:   "Visit Page"
      },
      {
        label: "YouTube",
        icon:  "fab fa-youtube",
        url:   "https://www.youtube.com/@RSVLab",
        color: "#FF0000",
        text:  "Subscribe to our channel for tutorials, research talks, and lab updates.",
        cta:   "Subscribe"
      },
    ],
  },

  /* ========== FOOTER ========== */
  footer: {
    copyright: "© 2026 RSV Lab — Kamol Das. All rights reserved.",
  },
};

/* Expose to window so render.js can always read it */
window.SITE = SITE;
