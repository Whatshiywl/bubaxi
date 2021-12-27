import { Injectable } from "@nestjs/common";
import { Knex, knex } from 'knex';

@Injectable()
export class KnexService {

  readonly instance: Knex;

  constructor() {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    const instance = knex({
      client: 'postgres',
      connection: {
        host : process.env.PG_HOST,
        user : process.env.PG_USER,
        password : process.env.PG_PASSWORD,
        database : process.env.PG_DB,
        ssl: true
      }
    });
    this.instance = instance;
  }

  get songs() {
    return this.instance('songs');
  }

}
