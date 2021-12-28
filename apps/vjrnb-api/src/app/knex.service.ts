import { Injectable } from "@nestjs/common";
import { Knex, knex } from 'knex';
import { environment } from "../environments/environment";

@Injectable()
export class KnexService {

  readonly instance: Knex;

  constructor() {
    const dev = !environment.production;
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    const instance = knex({
      client: 'postgres',
      connection: {
        host : process.env.PG_HOST,
        user : process.env.PG_USER,
        password : process.env.PG_PASSWORD,
        database : process.env.PG_DB,
        ssl: !dev
      }
    });
    this.instance = instance;

    this.init()
    .catch(err => console.error(err));
  }

  private async init() {
    const exists = await this.instance.schema.hasTable('songs');
    if (exists) return;
    await this.instance.schema.createTable('songs', table => {
      table.uuid('id').primary();
      table.string('artist').notNullable();
      table.string('title').notNullable();
      table.string('style').notNullable();
      table.string('decade').notNullable();
    });
  }

  get songs() {
    return this.instance('songs');
  }

}
