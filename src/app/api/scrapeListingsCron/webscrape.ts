import puppeteerExtra from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import type { UprightBassListing } from "../../interfaces/Interfaces";
import pLimit from "p-limit";

const limit = pLimit(4);

// const puppeteer = puppeteerExtra as any;

const objList: UprightBassListing[] = [];

export default async function scrapeData(toScrape: {
    talkBass?: boolean;
    scrapeBassChatData?: boolean;
    scrapeReverbData?: boolean;
}) {
    if (toScrape.talkBass === true) {
        // scrape TalkBass data
        console.log("scraping talkbass data...");
        await scrapeTalkBassData();
    }

    if (toScrape.scrapeBassChatData === true) {
        // scrape BassChat data
        console.log("scraping basschat data...");
        await scrapeBassChatData();
    }

    console.log("browser closed");
    return objList;
}

async function scrapeTalkBassData() {
    puppeteerExtra.use(StealthPlugin());

    // webscrape.ts (called during GET requests):

    async function initializeBrowser() {
        const browser = await puppeteerExtra.launch({
            headless: true,
            defaultViewport: null,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-accelerated-2d-canvas",
                "--disable-gpu",
            ],
            executablePath: puppeteerExtra.executablePath(),
        });
        return browser;
    }

    const browser = await initializeBrowser();
    const getNumPagesPage = await browser.newPage();

    await getNumPagesPage.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    );

    await getNumPagesPage.setViewport({
        width: 1920,
        height: 1080,
    });

    await getNumPagesPage.goto(
        "https://www.talkbass.com/classifieds/categories/for-sale-double-basses.144/?page=1?ad_type=for_sale",
        {
            waitUntil: "networkidle2",
            timeout: 60000,
        },
    );

    // let numPages = await getNumPagesPage.$$eval(
    //     ".pageNav-page",
    //     (elements: any) => {
    //         const matchingElement = elements.find(
    //             (el: HTMLElement) => el.classList.length === 1,
    //         );
    //         return matchingElement ? matchingElement.textContent : null;
    //     },
    // );

    // numPages = parseInt(numPages);

    await getNumPagesPage.close();

    const talkBassObjs: UprightBassListing[] = [];

    async function processMainTalkbassPage(i: number) {
        const page = await browser.newPage();
        try {
            await page.setUserAgent(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            );
            await page.setViewport({
                width: 1920,
                height: 1080,
            });

            await page.goto(
                `https://www.talkbass.com/classifieds/categories/for-sale-double-basses.144/?page=${i}&ad_type=for_sale`,
                {
                    waitUntil: "networkidle2",
                    timeout: 60000,
                },
            );

            console.log("now at page:", page.url());
            await page.waitForSelector(".block-container");
            const bassListings = await page.$$(`.structItem.structItem--ad`);

            console.log(
                `found ${bassListings.length} listing threads on page ${i} - now grabbing info from them`,
            );

            for (const thread of bassListings) {
                const obj: UprightBassListing = {
                    imgLink: "",
                    price: 0,
                    title: "",
                    year: 0,
                    location: "",
                    saleStatus: "",
                    listingLink: "",
                    source: "talkbass",
                };

                obj.title = await thread.$eval(
                    '.structItem-title a[data-tp-primary="on"]',
                    (el: Element) => el.textContent?.trim(),
                );

                const relativeListingLink = await thread.$eval(
                    '.structItem-title a[data-tp-primary="on"]',
                    (el: HTMLElement) => el.getAttribute("href"),
                );

                obj.listingLink = relativeListingLink ? "https://www.talkbass.com" + relativeListingLink.trim() : "";

                obj.saleStatus = "Available";

                if (obj.title) {
                    obj.year = searchTextForYearHelper(obj.title);
                }
                talkBassObjs.push(obj);
            }
        } catch (error) {
            console.log("error: ", error);
        } finally {
            page.close();
        }
    }

    async function processAllMainTalkbassPages() {
        try {
            const promises = [];
            for (let i = 1; i <= 20; i++) {
                // TODO: change to numPages for production
                promises.push(limit(() => processMainTalkbassPage(i)));
            }
            await Promise.all(promises);
        } catch (error) {
            console.log("error: ", error);
        }
    }

    await processAllMainTalkbassPages();
    console.log(
        "talkbassObjs sample - we'll grab more info from their listingLinks ",
        talkBassObjs.slice(0, 3),
    );

    async function processTalkbassListingPage(obj: UprightBassListing) {
        const page = await browser.newPage();
        try {
            await page.setUserAgent(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            );
            await page.setViewport({
                width: 1920,
                height: 1080,
            });

            if (obj.listingLink) {
                await page.goto(obj.listingLink, {
                    waitUntil: "domcontentloaded",
                    timeout: 10000,
                });
            }

            const uncleanPrice = await page.$eval(
                ".casHeader-price",
                (el: Element) => el.textContent?.trim() || "",
            );

            obj.price = cleanPriceHelper(uncleanPrice);
            obj.location = await page.$eval(
                ".adBody-fields.adBody-fields--header dd",
                (el: HTMLElement) => el.textContent?.trim() || "",
            );
            try {
                page.waitForSelector(".js-adImage");
                obj.imgLink = await page.$eval(
                    ".js-adImage",
                    (el: Element) => (el as HTMLImageElement).src || "",
                );
            } catch {
                obj.imgLink = "";
            }

            objList.push(obj);
            console.log("obj:", obj);
        } catch (error) {
            console.log("error: ", error);
        } finally {
            page.close();
        }
    }

    async function processAllTalkbassListingPages() {
        try {
            const promises = [];
            for (const obj of talkBassObjs) {
                promises.push(limit(() => processTalkbassListingPage(obj)));
            }
            await Promise.all(promises);
        } catch (error) {
            console.log("error: ", error);
        }
    }

    await processAllTalkbassListingPages();

    console.log("\n\n\n ***** Reached end of scrapeTalkBassData function *****");
    console.log("objs sample: ", objList.splice(0, 2));

    await browser.close();
}

async function scrapeBassChatData() {
    // webscrape.ts (called during GET requests):
    async function initializeBrowser() {
        const browser = await puppeteerExtra.launch({
            headless: true,
            defaultViewport: null,
            executablePath: puppeteerExtra.executablePath(),
        });
        return browser;
    }

    const browser = await initializeBrowser();
    const page = await browser.newPage();
    await page.goto(
        "https://www.basschat.co.uk/forum/76-eubs-double-basses-for-sale/",
    );

    const pageJumpCSSPath = ".ipsPagination_pageJump > a";
    await page.waitForSelector(pageJumpCSSPath);
    const pageOfPageText = await page
        .$(pageJumpCSSPath)
        .then((el) => el?.evaluate((el: Element) => el.textContent));
    const numPagesRegex = /\d+\s*(?=[^\d]*$)/;
    const numPagesMatch = pageOfPageText?.match(numPagesRegex);
    const numPages = numPagesMatch ? parseInt(numPagesMatch[0]) : 0;

    if (!numPages) {
        console.log("numPages not found, exiting early");
        return;
    }

    console.log("number of pages obtained to be: ", numPages);

    const itemCSSPath =
        ".ipsClear.ipsDataList.cForumTopicTable.cTopicList > .ipsDataItem.ipsDataItem_responsivePhoto";

    const bassChatObjs: UprightBassListing[] = [];

    try {
        for (let pageNum = 1; pageNum <= 3; pageNum++) {
            // TODO: change to numPages for production
            const listingsPageLink = `https://www.basschat.co.uk/forum/76-eubs-double-basses-for-sale/page/${pageNum}/`;
            await page.goto(listingsPageLink);
            await page.waitForSelector(itemCSSPath);
            const bassListings = await page.$$(itemCSSPath);

            console.log(
                `num bass listings found in page ${pageNum} = ${bassListings.length}`,
            );

            let threadNum = 0;
            for (const thread of bassListings) {
                threadNum += 1;
                if (
                    (threadNum == 1 && pageNum == 1) ||
                    (threadNum == 2 && pageNum == 1)
                ) {
                    // We're at the sticky threads which we want to skip (terms of conditions, advice for buyers and sellers)
                    console.log("@@@@@@ INSIDE A STICKY THREAD, SKIPPING @@@@@@");
                    continue;
                }

                const obj: UprightBassListing = {
                    imgLink: "",
                    price: 0,
                    title: "",
                    year: 0,
                    location: "",
                    saleStatus: "",
                    listingLink: "",
                    source: "basschat",
                };

                const relativeTitleCSSPath =
                    ".ipsDataItem_main > .ipsDataItem_title.ipsContained_container > span > a";
                try {
                    await thread.waitForSelector(relativeTitleCSSPath);
                } catch (error) {
                    console.log("error in waitForSelector:", error);
                    continue;
                }

                const titleElement = await thread.$(relativeTitleCSSPath);

                const uncleanTitle = await titleElement?.evaluate(
                    (el) => el.textContent,
                );

                if (!uncleanTitle || uncleanTitle === "") {
                    continue;
                }
                obj.title = uncleanTitle.replace(/[\t\n]/g, "").trim();
                if (
                    !obj.title ||
                    obj.title === "" ||
                    !availableFromTextBool(obj.title)
                ) {
                    continue;
                }

                obj.year = searchTextForYearHelper(obj.title);
                obj.saleStatus = "Available";
                obj.listingLink = await titleElement?.evaluate(
                    (el) => el.href,
                );

                if (!obj.listingLink || obj.listingLink === "") {
                    continue;
                }

                bassChatObjs.push(obj);
            }

            for (const obj of bassChatObjs) {
                if (obj.listingLink) { await page.goto(obj.listingLink) };

                const containerText = await page.$eval(
                    ".ipsType_pageTitle.ipsContained_container",
                    (el: Element) => el.innerHTML,
                );
                // console.log("container:", containerText);

                const containerArray = containerText.split("<br>", 3);
                // console.log("containerArray:", containerArray);

                if (
                    !containerArray ||
                    containerArray.length < 3 ||
                    containerArray[1] === "" ||
                    containerArray[2] === ""
                ) {
                    console.log("containerArray not found or too short, skipping");
                    continue;
                }

                const price = cleanPriceHelper(containerArray[1].trim());
                const location = containerArray[2].trim();

                obj.price = price;
                obj.location = location;

                // console.log("now finding image CSS path");
                const imageCSSPath = ".ipsImage.ipsImage_thumbnailed";

                // console.log("now grabbing image link...");
                try {
                    obj.imgLink = await page.$eval(
                        imageCSSPath,
                        (el) => (el as HTMLImageElement).src,
                    );
                } catch {
                    obj.imgLink = "";
                }

                objList.push(obj);
            }
        }
    } catch (error) {
        console.log(
            "@@@@@@@ ERROR in scrapeBassChatData(): ",
            error,
            " now exiting early.",
        );
        await browser.close();
        return;
    }

    await browser.close();
}

function cleanPriceHelper(price: string | number) {
    price = String(price);

    // remove currency symbols
    price = price.replace(/[\$£]/g, "");

    // remove decimal and tenths + hundredths place
    price = price.replace(/\.\d+/, "");

    // remove commas
    price = price.replace(/,/g, "");

    // k -> 000
    price = price.replace(/k/g, "000");

    price = parseInt(price);

    // check if NaN (hopefully not :) )
    if (isNaN(price)) {
        price = 0;
    }

    return price;
}

function searchTextForYearHelper(text: string) {
    const yearRegex = /\d+/g; // regex to find instance of a numeric value for year in object title div
    const matches = text.match(yearRegex);

    if (matches) {
        for (const numStr of matches) {
            const num = parseInt(numStr);
            if (num > 1500 && num <= 2025) {
                //console.log("Year detected!", num)
                return num;
            }
        }
    }

    return 0;
}

function availableFromTextBool(text: string) {
    const soldRegex = /\*SOLD\*/g;
    const soldMatches = text.match(soldRegex);

    const withdrawnRegex = /\*WITHDRAWN\*/g;
    const withdrawnMatches = text.match(withdrawnRegex);

    if (soldMatches || withdrawnMatches) {
        return false;
    }

    return true;
}