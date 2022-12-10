import { Client, ClientOptions } from "@postgres";
import { log } from "@prototypes";

// class PostgresService extends Client {
//     config: string | ClientOptions | undefined;
//     ready: boolean;

//     constructor(config: string | ClientOptions | undefined) {
//         super(config);

//         this.ready = this.connected;
//     }
// }

// class Table<schema> {
//     name: tableNames;
//     pk: string;

//     constructor(name: string, primaryKey: string) {
//         this.name = name;
//         this.pk = primaryKey;
//     }

//     async create(
//         id: string | string[],
//         data?: Partial<schema>,
//         returnValue?: boolean,
//     ): Promise<schema | schema[] | boolean> {
//         if (!id) return false;

//         let keys = "";
//         const values: unknown[] = [];

//         if (data) {
//             Object.entries(data)
//                 .forEach(([_key, val]) =>
//                     typeof val === "string"
//                         ? (
//                             val = String(val).replaceAll(`'`, `''`),
//                                 values.push(`'${val}'`)
//                         )
//                         : values.push(val as number)
//                 );
//             keys = `, "${Object.keys(data).join('", "')}"`;
//         }

//         const SQL = `
//         INSERT INTO "${this.name}"
//         ("${this.pk}"${keys})

//         VALUES
//         ('${id}'${`, ${values.join(", ")}` || ""});
//         `;

//         try {
//             if (Array.isArray(id)) {
//                 for (const i in id) {
//                     await pg.queryObject(SQL.replace(String(id), id[i]));
//                 }
//             } else await pg.queryObject(SQL);

//             if (returnValue) {
//                 return await pg[this.name].find(id);
//             }

//             return true;
//         } catch (e) {
//             log(`PG/CREATE/${this.name}`, "")
//                 .fail(`SQL: ${SQL}\n Erro: ${e.stack}`);

//             return false;
//         }
//     }
// }

const pg = new Client({ tls: { enabled: false } });

try {
    await pg.connect();
    if (!pg.connected) Promise.reject("Client not connected");

    self.postMessage({ id: 1, msg: "Banco de dados operante", service: pg });
} catch (e) {
    self.postMessage({ id: 0, msg: e.stack });
    self.close();
}

export default pg;
