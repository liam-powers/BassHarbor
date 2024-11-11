import { init as initAdmin } from '@instantdb/admin';
import { init } from '@instantdb/react'
import { UprightBassListing } from './interfaces/Interfaces';
const APP_ID = 'fe32c846-d9c4-490f-aa2d-6bcf23690511';

export function getAdminDB() {
    const INSTANTDB_ADMIN_TOKEN = process.env.INSTANTDB_ADMIN_TOKEN;
    if (!INSTANTDB_ADMIN_TOKEN) {
        console.error("INSTANTDB_ADMIN_TOKEN not found.");
        return;
    }

    type schema = {
        upright: UprightBassListing,
    }

    const db = initAdmin<schema>({ appId: APP_ID, adminToken: INSTANTDB_ADMIN_TOKEN });
    return db;
}

export function getDB() {
    type schema = {
        upright: UprightBassListing,
    }

    const db = init<schema>({ appId: APP_ID });
    return db;
}