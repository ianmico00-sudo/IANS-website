export interface HeroContent {
  title: string
  subtitle: string
  primaryButtonText: string
  secondaryButtonText: string
  backgroundImage?: string // Added background image support
}

export interface AboutContent {
  title: string
  paragraphs: string[]
  image?: string // Added optional image for about section
}

export interface Pillar {
  title: string
  description: string
  icon?: string // Added icon/image for each pillar
}

export interface Stat {
  number: string
  label: string
}

export interface WayToHelp {
  title: string
  description: string
  action: string
}

export interface SiteContent {
  hero: HeroContent
  about: AboutContent
  pillars: Pillar[]
  stats: Stat[]
  waysToHelp: WayToHelp[]
}

// Default content
export const defaultContent: SiteContent = {
  hero: {
    title: "Never Again Rwanda",
    subtitle: "Building sustainable peace and social justice through youth empowerment and community engagement",
    primaryButtonText: "Get Involved",
    secondaryButtonText: "Learn More",
    backgroundImage: "https://example.com/background.jpg", // Example background image
  },
  about: {
    title: "Our Mission",
    paragraphs: [
      "Never Again Rwanda (NAR) is a human rights and peacebuilding organization that aims to engage society in embracing peace and social justice. Since our founding in 2002, we have worked to improve the lives of all Rwandans through comprehensive programs focused on sustainable peace and development.",
      "We empower young people to become active citizens, enhancing their capacity to analyze conflict root causes and facilitate dialogue for sustainable peace and socio-economic development.",
    ],
    image: "https://example.com/about-image.jpg", // Example image for about section
  },
  pillars: [
    {
      title: "Peacebuilding",
      description:
        "Empowering citizens with non-violent means of resolving conflict, building trust, and promoting trauma healing and genocide prevention.",
      icon: "https://example.com/peacebuilding-icon.png", // Example icon for peacebuilding pillar
    },
    {
      title: "Governance & Human Rights",
      description:
        "Advocating for participatory and inclusive decision-making processes and rights-based approaches in all aspects of society.",
      icon: "https://example.com/governance-icon.png", // Example icon for governance pillar
    },
    {
      title: "Youth Engagement",
      description:
        "Promoting critical thinking, entrepreneurship, tolerance of diversity, and democratic values among young people.",
      icon: "https://example.com/youth-icon.png", // Example icon for youth engagement pillar
    },
    {
      title: "Research",
      description:
        "Conducting evidence-based research to inform policy and practice in peacebuilding and social justice initiatives.",
      icon: "https://example.com/research-icon.png", // Example icon for research pillar
    },
    {
      title: "Strategic Partnerships",
      description:
        "Collaborating with local and international organizations to amplify our impact and reach more communities.",
      icon: "https://example.com/partnerships-icon.png", // Example icon for strategic partnerships pillar
    },
  ],
  stats: [
    { number: "20+", label: "Years of Service" },
    { number: "50,000+", label: "Youth Empowered" },
    { number: "30", label: "Districts Reached" },
    { number: "100+", label: "Partner Organizations" },
  ],
  waysToHelp: [
    {
      title: "Volunteer",
      description: "Join our team of dedicated volunteers working to build peace and empower youth across Rwanda.",
      action: "Apply Now",
    },
    {
      title: "Donate",
      description: "Support our programs and help us reach more communities with your generous contribution.",
      action: "Donate Today",
    },
    {
      title: "Partner",
      description: "Collaborate with us to amplify impact and create sustainable change in communities.",
      action: "Become a Partner",
    },
  ],
}
