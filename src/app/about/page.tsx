export default function About() {
    return (
        <div className="flex flex-col justify-center pt-40 px-40 pb-20">
            <div className="text-4xl">about</div>

            <div className="flex flex-col gap-4 text-md leading-relaxed">
                <div>
                    A few years back, I was looking to upgrade from a cruddy student upright bass to something that would take me through university.
                    I poked around online and quickly realized that the market is overwhelming and hard to navigate. Not only were
                    there tons of different websites to monitor and compare listings between, but the existing websites also lacked basic filtering
                    functionality and showed minimal information from the thumbnails. On top of that, for showing such aesthetically pleasing instruments,
                    their UI&apos;s were ugly!
                </div>

                <div>
                    It took over 3 months for me to find and buy the right bass. Yes, it&apos;s a big purchase, and I absolutely spent plenty of time
                    deliberating between a few different instruments after trying them out - but a LOT of those 3 months was just spent prying through
                    forms and making sure I was getting the best bang for my buck.
                </div>

                <div>
                    As a Computer Science student at Northwestern University, I realized that I had the power to do something about this and get
                    justice for my low-end brethren. So Bass Harbor was born to make it easy for bassists to find the instrument of their dreams as quickly
                    as possible. Less time shopping, more time jamming.
                </div>

                <div>
                    We accomplish this by pulling sales from popular sales platforms such as talkbass.com and basschat.co.uk via
                    <span className="text-pastel-red"> Puppeteer</span>,
                    a web scraping library for <span className="text-pastel-red">JavaScript</span> (we use <span className="text-pastel-red">TypeScript</span>),
                    and make sure to do so every 24 hours by automating the scrapes in
                    <span className="text-pastel-red"> Firebase Functions</span>.
                </div>

                <div>
                    We also let you filter our bass listings (stored in <span className="text-pastel-red">Firestore</span>) for important aspects such as price, type of wood, and keywords you
                    may be interested in. This information, along with the year of make,
                    is obtained with some back-end magic - namely regular expressions.
                </div>

                <div>
                    Bass Harbor is 0% involved with the finances of your purchase or sponsored by any advertisements - it is merely an unbiased
                    source that redirects you to the original point of the sale&apos;s origin, while providing better functionality and a more pleasing
                    UI/UX than the incumbents.
                    <span className="text-pastel-red"> React </span>
                    and
                    <span className="text-pastel-red"> Next.js</span> make this all possible.
                </div>

                <div>
                    The result? A single platform for finding an instrument that matches all of your needs as quick as possible.
                    At least, that&apos;s the hope! If you have any feedback, fill out this

                    <a href="https://forms.gle/NxHoCoM27odWGwvaA" rel="noopener noreferrer" target="_blank">
                        <span className="underline text-blue-400"> Google Form </span>
                    </a>

                    and I&apos;ll gladly follow up with you if there are any questions.
                </div>

                <div className="font-bold">
                    - Liam
                </div>
            </div>
        </div>
    );
}