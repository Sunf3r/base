import Workers from "../JSON/Workers.json" assert { type: "json" };
import { log } from "@prototypes";
import { delay } from "@std";

export default async function loadServices(dir: string) {
    for (const svc of Deno.readDirSync(dir)) {
        const sector = svc.name.toSector() as threadFiles;
        const name = Workers[sector]?.name as threadNames;

        if (services[name]?.ready) continue;
        const spinner = log(sector, "Carregando serviço...");

        const worker = new Worker(
            import.meta.resolve(`file:${dir}/${svc.name}`),
            {
                type: "module",
                deno: {
                    permissions: Workers[sector]?.perms || "none",
                },
            },
        );

        return await new Promise((res) => {
            worker.onmessage = async (event: MessageEvent) => {
                const { id, msg, src } = event.data;

                if (id === 1) {
                    spinner.end(msg);
                    services[name] = src;
                    res(true);
                } else {
                    spinner.fail(msg);
                    await delay(15_000);
                    services[name].ready = false;
                    loadServices(dir);
                }
            };
        });
    }
}
