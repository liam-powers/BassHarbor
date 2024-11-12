import type { UprightBassListing } from "@/app/interfaces/Interfaces";
import { ofetch } from "ofetch";
import * as cheerio from "cheerio";

export default async function scrapeData(toScrape: {
    scrapeBasschatData?: boolean;
    scrapeUptonbassData?: boolean;
    scrapeBasscellarData?: boolean;
}): Promise<UprightBassListing[]> {
    try {
        const listings: UprightBassListing[] = [];
        if (toScrape.scrapeBasschatData) {
            const basschatListings = await scrapeSource("basschat");
            listings.push(...basschatListings);
        }
        if (toScrape.scrapeUptonbassData) {
            const uptonbassListings = await scrapeSource("uptonbass");
            listings.push(...uptonbassListings);
        }
        if (toScrape.scrapeBasscellarData) {
            const basscellarListings = await scrapeSource("basscellar");
            listings.push(...basscellarListings);
        }
        return listings;
    } catch (error) {
        console.error(error);
        throw new Error("Error scraping data!");
    }
};

const sourceInfo = {
    basschat: {
        htmlPaths: {
            pageCounter: ".ipsPagination_pageJump > a",
            allListingsOnPage: ".ipsClear.ipsDataList.cForumTopicTable.cTopicList > .ipsDataItem.ipsDataItem_responsivePhoto",
            aTag: ".ipsDataItem_main > .ipsDataItem_title.ipsContained_container > span > a",
            image: ".ipsDataItem.ipsDataItem_responsivePhoto > .tthumb_wrap > a > .tthumb_standard",
            lastActivity: "ul.ipsDataItem_lastPoster.ipsDataItem_withPhoto.ipsType_blendLinks > li.ipsType_light > a.ipsType_blendLinks > time",
            price: ".ipsType_pageTitle.ipsContained_container",
            location: ".ipsType_pageTitle.ipsContained_container",
            description: ".ipsType_normal.ipsType_richText.ipsPadding_bottom.ipsContained",
        },
        urlInfo: {
            baseUrl: "https://www.basschat.co.uk/forum/76-eubs-double-basses-for-sale",
            pageRequestType: "urlParams"
        },
    },
    uptonbass: {
        htmlPaths: {
            pageCounter: "",
            allListingsOnPage: "",
            aTag: "",
            image: "",
            lastActivity: "",
            price: "",
            location: "",
            description: "",
        },
        urlInfo: {
            baseUrl: "https://uptonbass.com/product-category/vintage-used-basses/vintage-used-double-basses",
            pageRequestType: "urlParams",
        },
    },
    basscellar: {
        htmlPaths: {
            pageCounter: "",
            allListingsOnPage: "",
            aTag: "",
            image: "",
            lastActivity: "",
            price: "",
            location: "",
            description: "",
        },
        urlInfo: {
            baseUrl: "https://basscellar.com/product-category/basses/basses-under-7-5k/",
            pageRequestType: "urlParams",
        },
    },
}

async function tryFetchHtmlToCheerio(url: string, source: string): Promise<cheerio.CheerioAPI> {
    let res: string;

    if (["basschat", "uptonbass", "basscellar"].includes(source)) {
        res = await ofetch(url);
        const headers = {
            Host: "reverb.com",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:132.0) Gecko/20100101 Firefox/132.0",
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Accept-Encoding": "gzip, deflate, br, zstd",
            Referer: "https://www.google.com/",
            Connection: "keep-alive",
            Cookie: `elog-analytics-2={"lastSeen":1731384468168,"id":"dec7d1c7-05bd-4a2e-b081-e000968ef9fd","sessionID":"6f25e800-39e0-4abc-9439-e6997696067e"}; reverb_user_shipping_region=US_CON; reverb_user_currency=USD; reverb_user_locale=en; reverb_user_country_code=US; csrf_token=Ft8IJMSxW6wnwBuKYvlEFq8DrWA0bnLhVVQTvTAscNOPEwiADJCUUDVzDWrPnlgsR_xb_wTmo2oIsv6DskQUAA; _reverb_session=OGVFb203L0JlQU9ldVBrNGpNdGIzSnllT1Zqaml2T3NVZlljZ0FvaHkxdzEvaTBmT2JHa3B2RHFxc3Fmdmd6UDBHOW5FOU54RWhYSHhvTDhXcmxXblZhTzZwcStiSEJqTWR5dDNTVU9qQTdtYkQ2YVhwVk5hdXdneTlSRTA0UDBtck1obGY0Tmh2akp3QXRNOFRYeFlZOTRxaXhpTmRvV0dLVkVFanZ0Z0hBdVNJdFRnQjVkTFJnb0pWWXRSeEJKME4ycjU5Vi9yRnB0QWp6K0U1bWhWRGwwYk51V011OFRhNU82czZXZUQwbThRT2xkbVFGU0ZDSnFLSzh6ZUJzWGRZalZVNEl6RG1BSjNicmxoOUJCYjE3NmE0L0hJNzc5NmNiOWpEMlI4L01OdnU4a01RQmZIdktGR0pEd0s0QnFaNFhwdFZJQngveWhpcnE3L2p2SGF4ZkhhVXZvWVJCK0EzTlY5UHZKNWxleThZNEJ5eHMxRnBwVWgyaDN5T3ZMbjhiVnBqUjQ0OE1PblRYUFhEcWtHRkNpNEtiRmlMcEVBTlRyU2g1ZWFKU1o3Qnl1NllDemp2MEFKWjcyMVo5eC0tZklocDNzZm5LNXF2aVlpcG5KamVuQT09--ca9074f03f7147702efa076749a14a17e6a2fd61; __cf_bm=oLAQauMaKi07JZO.Ix_2j98_97cxeFj8AH97TafOJhM-1731384282-1.0.1.1-3iplQojoLtHKn43JE7WfLuWwHrM87BlC2.QVZ2i077hqdmdJ6g2L7FsXuFVqM0jsY_m8jnmzvm5xgS1t0VfqNw; reverb_page_views=2; google_cid=undefined`,
            "Upgrade-Insecure-Requests": "1",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "cross-site",
            "Sec-Fetch-User": "?1"
        };
        res = await ofetch(url, { headers });
    } else {
        throw new Error("faulty source in tryFetchHtmlToCheerio");
    }

    const $ = cheerio.load(res);
    return $;
}


async function scrapeSource(source: keyof typeof sourceInfo): Promise<UprightBassListing[]> {
    try {
        const listings: UprightBassListing[] = [];
        console.log(`scraping source ${source}`);

        let url = sourceInfo[source].urlInfo.baseUrl;
        let $ = await tryFetchHtmlToCheerio(url, source);

        // get our number of pages
        const pageCounter = $(sourceInfo[source].htmlPaths.pageCounter).text();
        console.log("pageCounter text:", pageCounter);
        let numPages;
        if (source === "basschat") {
            numPages = parseInt(pageCounter.split(" ")[3]);
        }

        if (!numPages) {
            throw new Error("Something went wrong finding numPages in scrapeBasschatData!");
        }

        console.log("number of pages obtained to be: ", numPages);

        let listingsSkipped = 0;
        let listingSkippedAvailability = 0;
        let listingsPushed = 0;

        let onActiveListings = true;
        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
            url = `https://www.basschat.co.uk/forum/76-eubs-double-basses-for-sale/page/${pageNum}`;
            const res: string = await ofetch(url);
            $ = cheerio.load(res);

            console.log(`Page ${pageNum}`)
            const allListingsOnPage = $(sourceInfo[source].htmlPaths.allListingsOnPage);
            const numListings = allListingsOnPage.length;

            const startingPushed = listingsPushed;
            if (!onActiveListings) {
                console.log("Detected that listings have not been active in past two years from now on. Returning!");
                break;
            }

            for (let listingNum = 0; listingNum < numListings; listingNum++) {
                // ignore pinned guideline threads
                if (pageNum === 1 && (listingNum === 0 || listingNum === 1)) {
                    listingsSkipped++;
                    continue;
                }

                const listingElement = allListingsOnPage.eq(listingNum);

                const aTag = listingElement.find(sourceInfo[source].htmlPaths.aTag);

                const title = aTag.text().trim();
                if (!title || title.toLowerCase().includes("sold") || title.toLowerCase().includes("withdrawn")) {
                    listingsSkipped++;
                    listingSkippedAvailability++;
                    continue;
                }

                const link = aTag.attr("href");
                if (!link) {
                    listingsSkipped++;
                    continue;
                }

                const imageElement = listingElement.find(sourceInfo[source].htmlPaths.image);
                let image = imageElement.attr("style")?.split("//")[1].split("'")[0];
                if (!image || (image.slice(0, 3) !== "cdn")) {
                    listingsSkipped++;
                    continue;
                }

                image = "https://" + image;

                const lastActivityElement = listingElement.find(sourceInfo[source].htmlPaths.lastActivity);
                const lastActivityIso8601 = lastActivityElement.attr("datetime");
                if (!lastActivityIso8601) {
                    listingsSkipped++;
                    continue;
                }
                const lastActivity = new Date(lastActivityIso8601).getTime();
                const twoYearsInMilliseconds = 365 * 2 * 24 * 60 * 60 * 1000;

                const now = new Date().getTime();
                // not considering listings without activity in the past two years
                if (now - lastActivity > twoYearsInMilliseconds) {
                    const nowDate = new Date(now).toLocaleString();
                    const lastActivityDate = new Date(lastActivity).toLocaleString();
                    console.log(`@@@@@@@ Last Activity: ${lastActivityDate}, Now: ${nowDate}, Time Difference: ${now - lastActivity} ms, Two Years in ms: ${twoYearsInMilliseconds}`);
                    console.log("listing title: ", title);
                    console.log("setting onActiveListings to false");
                    listingsSkipped++;
                    onActiveListings = false;
                    break;
                }

                //
                // time to go to listing link for more information
                //
                url = link;
                const res: string = await ofetch(url);
                $ = cheerio.load(res);

                const priceLocationElementContent = $(sourceInfo[source].htmlPaths.price).html()?.split("<br>");
                if (!priceLocationElementContent) {
                    listingsSkipped++;
                    continue;
                }
                const priceUnclean = priceLocationElementContent[1];
                if (!priceUnclean) {
                    listingsSkipped++;
                    continue;
                }

                const { currency, price, error } = getCurrencyAndPrice(priceUnclean);
                if (error) {
                    console.error(`Error with getCurrencyAndPrice: ${error}`)
                    listingsSkipped++;
                    continue;
                }

                const location = priceLocationElementContent[2]?.trim();
                if (!location) {
                    listingsSkipped++;
                    continue;
                }

                const description = $(sourceInfo[source].htmlPaths.description).find("p").map((i, el) => $(el).text().trim()).get().join(" ");

                const possibleTitleYears = searchTextForYearsHelper(title);
                const possibleDescriptionYears = searchTextForYearsHelper(description);
                let year;

                // Preferring years obtained from description
                if (possibleDescriptionYears.length > 0) {
                    year = possibleDescriptionYears[0];
                } else if (possibleTitleYears.length > 0) {
                    year = possibleTitleYears[0];
                }

                const commonMakers = [
                    "Guarneri", "Stradivarius", "Amati", "Roth",
                    "Kay", "Engelhardt", "New Standard", "Kolstein",
                    "Shen", "Upton", "Christopher", "Thompson",
                    "Czech-Ease", "Eminence", "NS Design", "Yamaha",
                    "Eastman", "Cremona", "Palatino", "Stentor",
                    "Pfretzschner", "Zeller", "Yamaha", "David Gage",
                ];

                const possibleTitleMakers = commonMakers.filter((maker) => title.includes(maker));
                const possibleDescriptionMakers = commonMakers.filter((maker) => description.includes(maker));

                let maker;
                // Preferring makers obtained from title
                if (possibleTitleMakers.length > 0) {
                    maker = possibleTitleMakers[0];
                } else if (possibleDescriptionMakers.length > 0) {
                    maker = possibleDescriptionMakers[0];
                }

                const listing: UprightBassListing = {
                    title,
                    link,
                    image,
                    price,
                    currency,
                    source: "basschat",
                    lastActivity,
                    location,
                    year,
                    maker,
                }

                listingsPushed++;
                listings.push(listing);
            }

            console.log(`skipped ${listingsPushed - startingPushed} listings on page ${pageNum}`);
        }

        console.log(`skipped ${listingsSkipped} listings, ${listingSkippedAvailability} of which were for SOLD or WITHDRAWN in title, and pushed ${listingsPushed} listings`);
        console.log(`now returning ${listings.length} listings`);
        return listings;
    } catch (error) {
        console.error(error);
        throw new Error("Error scraping Basschat data!");
    }
}

const currencySymbols = new Set([
    "$", "€", "£", "¥", "₹", "₩", "₽", "₿", "฿", "₪", "₫", "₴", "₦", "₲", "₱"
]);

const currencySymbolsArray = [...currencySymbols].join("");

function getCurrencyAndPrice(priceUnclean: string): { currency: string, price: number, error?: Error } {
    priceUnclean = priceUnclean.trim();

    const currency = priceUnclean.slice(0, 1);
    if (!currencySymbols.has(currency)) {
        return { currency: " ", price: -1, error: new Error("Error with currency!") };
    };

    // remove currency symbols
    const currencyRegex = new RegExp(`[${currencySymbolsArray}]`, "g");
    priceUnclean = priceUnclean.replace(currencyRegex, "");


    // remove decimal and tenths + hundredths place
    priceUnclean = priceUnclean.replace(/\.\d+/, "");

    // remove commas
    priceUnclean = priceUnclean.replace(/,/g, "");

    // k -> 000
    priceUnclean = priceUnclean.replace(/k/g, "000");

    const price = parseInt(priceUnclean);

    if (isNaN(price)) {
        throw new Error(`Price NaN of: ${price} for priceUnclean: ${priceUnclean}`);
    }

    return { currency, price };
}

function searchTextForYearsHelper(text: string): number[] {
    const yearRegex = new RegExp(`(?<![${currencySymbolsArray}])\\b\\d{4}\\b`, "g"); // regex to find instance of a numeric value for year in object title div without currency symbols in front
    const matches = text.match(yearRegex);

    const possibleYears: number[] = [];

    if (matches) {
        for (const numStr of matches) {
            const num = parseInt(numStr);
            if (num > 1500 && num <= 2025) {
                possibleYears.push(num);
            }
        }
    }

    return possibleYears;
}