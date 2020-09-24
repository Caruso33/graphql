import { Migration } from '@mikro-orm/migrations';

export class Migration20200922195741 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "queue" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "title" text not null);');
  }

}
