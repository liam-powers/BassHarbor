export default function About() {
    const qAndA = [
        {
            question: "What is this?",
            answer: "A site that takes listings for upright basses around the web and puts them here to discover so you can better filter, compare, and browse them.",
        },
        {
            question: "Why?",
            answer: "A few years back, I was looking to buy an upright bass and found it difficult to find what I was looking for and to compare listings across different sites. I wanted to make it easier for others to find their dream bass while improving my coding skills.",
        },
        {
            question: "What sources do you pull from?",
            answer: "Currently, the site uses data from basschat.co.uk, basscellar.com, and uptonbass.com. Initally the inspiration for the site was to make some sense of the huge amount of TalkBass listings, but recently TalkBass underwent a site redesign and the anti-bot measures they've taken require more overhead than I'd like for the scope of the project.",
        },
        {
            question: "What technologies are used?",
            answer: "The frontend is in React with Next.js 15 and its app router. The backend is written with API routes and uses cheerio to parse HTML data, and the data is fetched every 24 hours via a Vercel cron job. The database is InstantDB, which I've been particularly liking for the easy setup, tooling, and query language. Previously the site used Firebase functions (running puppeteer-extra headless) with Firestore, but I found their deployment and tooling inefficient, especially given the migration to cheerio.",
        },
    ];
    return (
        <div className="flex flex-col justify-center pt-40 px-40 pb-20">
            <div className="text-4xl font-bold pb-8">about</div>
            <div className="flex flex-col gap-8 text-md leading-relaxed pr-[80rem]">
                {qAndA.map((qa) => (
                    <div key={qa.question}>
                        <div className="font-bold text-2xl">{qa.question}</div>
                        <div className="text-xl">{qa.answer}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}