import type { Metadata } from "next";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer";

export const metadata: Metadata = {
    title: "Terms & Conditions",
    description:
        "The terms and conditions governing the use of BookUrEvents services for event planning, management, and related offerings.",
};

const sections = [
    {
        title: "1. Acceptance of Terms",
        body: [
            "By engaging BookUrEvents (\"we\", \"us\", \"our\") for any event planning, management, or related service, or by using this website, you (\"the Client\", \"you\") agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our services.",
            "These terms apply to all enquiries, bookings, quotations, and events undertaken by BookUrEvents across India and at destination locations.",
        ],
    },
    {
        title: "2. Our Services",
        body: [
            "BookUrEvents provides end to end event management services including, but not limited to, corporate events, weddings, private celebrations, entertainment, catering and bar, design and decor, film and photography, and venue and logistics coordination.",
            "The exact scope of services for your event will be defined in the proposal, quotation, or written agreement shared with you. Any service not expressly included in that scope is not part of our engagement.",
        ],
    },
    {
        title: "3. Bookings, Quotations & Confirmation",
        body: [
            "All quotations are valid for the period stated in the proposal and are subject to availability of dates, venues, and vendors at the time of confirmation.",
            "A booking is considered confirmed only upon receipt of the agreed advance payment and a signed proposal or written confirmation. Until then, dates and services are not held or guaranteed.",
            "Estimates may be revised if the requirements, guest count, scope, dates, or venue change after confirmation.",
        ],
    },
    {
        title: "4. Payments",
        body: [
            "An advance payment is required to confirm any booking, with the balance payable as per the schedule set out in your agreement. Final balances are typically due before the event date unless otherwise agreed in writing.",
            "All prices are exclusive of applicable taxes unless stated otherwise. Any third party costs, permits, or charges incurred on your behalf will be billed to you.",
            "Late payments may result in suspension of services. We reserve the right to withhold delivery of services until due payments are cleared.",
        ],
    },
    {
        title: "5. Cancellation & Refunds",
        body: [
            "Cancellation requests must be made in writing. As event planning involves advance commitments to venues and vendors, cancellation charges apply and increase as the event date approaches.",
            "Advance payments are generally non refundable, as they secure dates and are committed to suppliers on your behalf. Refund of any remaining amount, if applicable, will be assessed after deducting all costs already incurred and committed.",
            "Amounts paid to third party vendors are subject to those vendors' individual cancellation policies.",
        ],
    },
    {
        title: "6. Postponement & Force Majeure",
        body: [
            "If an event is postponed, we will make reasonable efforts to transfer your booking to a new date, subject to availability. Additional charges may apply, and vendor availability cannot be guaranteed for the new date.",
            "BookUrEvents shall not be liable for any failure or delay in performance caused by events beyond our reasonable control, including natural disasters, government restrictions, strikes, pandemics, or other force majeure events.",
        ],
    },
    {
        title: "7. Client Responsibilities",
        body: [
            "You agree to provide accurate, complete, and timely information, approvals, and materials required to plan and execute your event.",
            "You are responsible for the conduct of your guests, for obtaining any permissions specific to your requirements, and for any damage caused by you or your guests to venues or hired equipment.",
        ],
    },
    {
        title: "8. Third-Party Vendors & Suppliers",
        body: [
            "We work with a trusted network of vendors and suppliers. While we coordinate and manage them on your behalf, certain services are delivered directly by these third parties and are subject to their own terms.",
            "BookUrEvents is not liable for the independent acts, omissions, or failures of third party vendors, though we will always act in your best interest to resolve any issues.",
        ],
    },
    {
        title: "9. Photography, Film & Intellectual Property",
        body: [
            "Unless you request otherwise in writing, BookUrEvents may capture photographs and video of events we manage and use them for portfolio, marketing, and promotional purposes across our website and social channels.",
            "All concepts, designs, plans, and creative materials prepared by BookUrEvents remain our intellectual property unless expressly transferred to you in writing.",
        ],
    },
    {
        title: "10. Limitation of Liability",
        body: [
            "To the maximum extent permitted by law, our total liability arising out of or in connection with any event shall not exceed the total fees paid by you to BookUrEvents for that event.",
            "We shall not be liable for any indirect, incidental, or consequential losses, including loss of profit, opportunity, or goodwill.",
        ],
    },
    {
        title: "11. Privacy & Data",
        body: [
            "We collect and process personal information you share with us solely to provide and improve our services. We do not sell your personal data.",
            "Details submitted through our contact and feedback forms are used to respond to your enquiry and manage your event. By submitting these forms you consent to such use.",
        ],
    },
    {
        title: "12. Governing Law & Jurisdiction",
        body: [
            "These Terms and Conditions are governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the competent courts.",
        ],
    },
    {
        title: "13. Contact Us",
        body: [
            "For any questions about these Terms and Conditions, please contact us at info@bookurevents.in or call +91 8700901115.",
        ],
    },
];

export default function TermsPage() {
    return (
        <Navbar isNavbarMargin={false}>
            <main className="grain relative overflow-hidden bg-ink pt-36 pb-24 md:pt-44 md:pb-32">
                <div className="glow left-[-8%] top-[8%] h-[420px] w-[420px] bg-[radial-gradient(circle,rgba(212,175,55,0.10),transparent_70%)]" />

                <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mx-auto max-w-3xl text-center">
                        <span className="eyebrow">Legal</span>
                        <h1 className="font-display mt-5 text-4xl font-light leading-tight text-ivory md:text-6xl">
                            Terms &amp;
                            <span className="text-gold-grad italic"> Conditions</span>
                        </h1>
                        <p className="mt-5 text-sm text-ivory-soft">Last updated: June 2026</p>
                    </div>

                    {/* Content */}
                    <div className="mx-auto mt-16 max-w-3xl space-y-12">
                        {sections.map((section) => (
                            <section key={section.title}>
                                <h2 className="font-display text-2xl text-ivory">{section.title}</h2>
                                <div className="mt-4 space-y-4">
                                    {section.body.map((para, i) => (
                                        <p key={i} className="leading-relaxed text-ivory-soft">
                                            {para}
                                        </p>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </Navbar>
    );
}
