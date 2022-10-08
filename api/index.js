import { fastify as f } from "fastify";
import { port } from "../config.js"

export default async function(){
    const fastify = f();

    fastify.get('/', async (req, res) => {
        return "Advance v3 (Alpha) by Nanoo\n"
        + "Created: 07.10.2022\n\n"
        + "Using:\n"
        + " > osu!api v2 with node-fetch (Recieve & Save Stats)\n"
        + " > mysql-await (Database)\n"
        + " > Fastify (API)\n"
        + " > Cutesy (Logger)\n\n"
        + "Modules:\n"
        + " > osu! Authentication\n"
        + " > Fetch Best Scores (WIP)\n"
        + " > Fetch Recent Scores (WIP)\n"
        + " > Fetch Ranks (WIP)\n"
        + " > Database (WIP)\n\n"
        + "API:\n"
        + " > [GET] Create User -> /api/users/create (WIP)\n"
        + " > [GET] Get User -> /api/users/{id} (WIP)\n"
        + " > [GET] Best Scores -> /api/scores/{id}/best (WIP)\n"
        + " > [GET] Recent Scores -> /api/scores/{id}/recent (WIP)\n"
        + " > [GET] Best Ranks -> /api/ranks/{id}/best (WIP)\n"
        + " > [GET] Rank History -> /api/ranks/{id} (WIP)\n\n"
        + "Stats:\n"
        + " > Users: Pending\n"
        + " > Scores: Pending\n"
        + " > Ranks: Pending\n\n"
        + "Feel free to follow this on GitHub! -> https://github.com/calemy/advance"
    })

    fastify.listen({ port })
}