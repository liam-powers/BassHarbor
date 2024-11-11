import { ofetch } from 'ofetch';

export async function call() {
    // const res = await ofetch("http://localhost:3000/api/fetchListings", {
    //     method: "POST",
    //     body: {
    //         keywords: [],
    //         carved: false,
    //         hybrid: false,
    //         plywood: false,
    //         priceRange: [],
    //     }
    // }
    // );
    const res = await ofetch("http://localhost:3000/api/scrapeListingsCron");
    console.log('res: ', res);
    return res;
}
