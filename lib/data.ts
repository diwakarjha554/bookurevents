import * as ICON from "lucide-react";

// Unsplash CDN helper (all IDs verified to resolve)
const img = (id: string, w = 1200) =>
    `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const IMAGES = {
    hero: img("1519741497674-611481863552", 2000), // golden bride & groom silhouette
    aboutMain: img("1583939003579-730e3918a45a", 1100), // wedding kiss, petals
    aboutAccent: img("1556125574-d7f27ec36a06", 900), // gala dinner, gold balloons
};

export const DATA = {
    uNav: {
        message: 'By invitation to extraordinary occasions - now booking the 2026 season',
    },
    navlinks: [
        { href: '/', label: 'Home' },
        { href: '#about', label: 'About' },
        { href: '#services', label: 'Services' },
        { href: '#portfolio', label: 'Portfolio' },
        { href: '#contact', label: 'Contact' }
    ],
    marquee: [
        "Corporate Galas",
        "Luxury Weddings",
        "Product Launches",
        "Private Celebrations",
        "Destination Events",
        "Conferences & Summits",
        "Brand Activations",
        "Curated Experiences",
    ],
    services: [
        {
            icon: ICON.Building2,
            title: "Corporate Events",
            description: "Conferences, summits, and brand moments engineered to impress boardrooms and audiences alike.",
            features: ["Conferences & Summits", "Product Launches", "Award Nights"],
            image: img("1511578314322-379afb476865", 800),
        },
        {
            icon: ICON.Gem,
            title: "Luxury Weddings",
            description: "Weddings designed around your story, with every ritual and detail composed to perfection.",
            features: ["Venue & Design", "Decor & Florals", "Full Coordination"],
            image: img("1469371670807-013ccf25f16a", 800),
        },
        {
            icon: ICON.Sparkles,
            title: "Private Celebrations",
            description: "Birthdays, anniversaries, and intimate gatherings turned into occasions worth remembering.",
            features: ["Theme Design", "Guest Experience", "Entertainment"],
            image: img("1530103862676-de8c9debad1d", 800),
        },
        {
            icon: ICON.Music4,
            title: "Entertainment",
            description: "Live acts, artists, and DJs curated to set the mood and hold the room from first cue to last.",
            features: ["Live Bands", "Celebrity Artists", "DJ & Sound"],
            image: img("1470229722913-7c0e2dbbafd3", 800),
        },
        {
            icon: ICON.Camera,
            title: "Film & Photography",
            description: "Cinematic coverage that captures the feeling of the day, not just the moments within it.",
            features: ["Photography", "Cinematography", "Live Streaming"],
            image: img("1492684223066-81342ee5ff30", 800),
        },
        {
            icon: ICON.UtensilsCrossed,
            title: "Catering & Bar",
            description: "Bespoke menus and beverage programs crafted with leading chefs and trusted partners.",
            features: ["Bespoke Menus", "Service Staff", "Premium Bar"],
            image: img("1414235077428-338989a2e8c0", 800),
        },
        {
            icon: ICON.Flower2,
            title: "Design & Decor",
            description: "Florals, lighting, and set design that transform any space into an immersive world.",
            features: ["Floral Design", "Lighting", "Set & Stage"],
            image: img("1522413452208-996ff3f3e740", 800),
        },
        {
            icon: ICON.MapPin,
            title: "Venue & Logistics",
            description: "Venue sourcing, hospitality, and on ground logistics handled end to end, seamlessly.",
            features: ["Venue Sourcing", "Hospitality", "Production"],
            image: img("1530023367847-a683933f4172", 800),
        },
    ],
    // Portfolio gallery (varied real event photography)
    gallery: [
        { image: img("1583939003579-730e3918a45a", 900), title: "A Garden Wedding", category: "Weddings", span: "lg:row-span-2" },
        { image: img("1540575467063-178a50c2df87", 800), title: "Annual Summit", category: "Corporate", span: "" },
        { image: img("1530023367847-a683933f4172", 800), title: "Seaside Reception", category: "Destination", span: "" },
        { image: img("1511795409834-ef04bbd61622", 900), title: "The Banquet", category: "Decor", span: "lg:row-span-2" },
        { image: img("1505236858219-8359eb29e329", 800), title: "After Party", category: "Entertainment", span: "" },
        { image: img("1465495976277-4387d4b0b4c6", 800), title: "The Vows", category: "Weddings", span: "" },
        { image: img("1555244162-803834f70033", 800), title: "Grand Buffet", category: "Catering", span: "" },
        { image: img("1519671482749-fd09be7ccebf", 800), title: "Raise a Toast", category: "Celebrations", span: "" },
    ],
    homeTrust: [
        {
            icon: ICON.Sparkle,
            value: 99,
            suffix: "%",
            label: "Client Satisfaction",
            note: "Clients who would book us again",
        },
        {
            icon: ICON.CalendarCheck,
            value: 250,
            suffix: "+",
            label: "Events Delivered",
            note: "Across corporate and private",
        },
        {
            icon: ICON.Award,
            value: 25,
            suffix: "+",
            label: "Industry Recognitions",
            note: "Awards and features earned",
        },
        {
            icon: ICON.MapPinned,
            value: 30,
            suffix: "+",
            label: "Cities Served",
            note: "PAN India and destination",
        },
    ],
    testimonials: [
        {
            quote: "They did not just plan our event, they understood the feeling we wanted in the room and delivered it flawlessly. Every guest is still talking about it.",
            name: "Ananya & Rohan",
            role: "Luxury Wedding, Udaipur",
        },
        {
            quote: "The most organised team we have worked with. Our product launch ran to the second and looked world class. We will not work with anyone else.",
            name: "Priya Menon",
            role: "Marketing Head, Tech Brand",
        },
        {
            quote: "From the first call to the last guest leaving, everything felt effortless on our side. That is the real luxury they sell.",
            name: "Vikram Shetty",
            role: "Annual Corporate Gala",
        },
    ],
    team: [
        {
            name: "Irshad Pathan",
            role: "Head of Business",
            image: "/irshad.jpeg",
            bio: "Irshad leads business strategy and client partnerships at BookUrEvents, turning first conversations into lasting relationships and making sure every client receives the experience they were promised.",
            expertise: ["Business Strategy", "Client Relations", "Partnerships"],
            social: {
                linkedin: "#",
                twitter: "#",
                email: "irshad@bookurevents.in",
            },
        },
        {
            name: "Rishabh Singh Rajput",
            role: "Head of Operations",
            image: "/rishabh.jpg",
            bio: "Rishabh oversees on ground execution and logistics, making sure every event runs on schedule and every detail is handled with precision from setup to final wrap.",
            expertise: ["Operations", "Logistics", "Execution"],
            social: {
                linkedin: "#",
                twitter: "#",
                email: "rishabh@bookurevents.in",
            },
        },
        {
            name: "Aman Kumar",
            role: "Head of Marketing",
            image: "/aman.jpg",
            bio: "Aman drives brand and campaign strategy, helping clients reach the right audience and giving every event the visibility and presence it deserves.",
            expertise: ["Marketing", "Brand Strategy", "Campaigns"],
            social: {
                linkedin: "#",
                twitter: "#",
                email: "aman@bookurevents.in",
            },
        },
        {
            name: "Sujeet Sahni",
            role: "Head of Technology & Staffing",
            image: "/sujeet.png",
            bio: "Sujeet manages technology, staffing, and production support, bringing skilled teams and the right tools together for a flawless event experience every time.",
            expertise: ["Technology", "Staffing", "Production"],
            social: {
                linkedin: "#",
                twitter: "#",
                email: "sujeet@bookurevents.in",
            },
        },
    ]
};
