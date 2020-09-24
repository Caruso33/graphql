import { Migration } from '@mikro-orm/migrations';

export class Migration20200924180904 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "slip" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "processed" jsonb not null, "user_id" int4 not null, "queue_id" int4 not null);');

    this.addSql('alter table "slip" add constraint "slip_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "slip" add constraint "slip_queue_id_foreign" foreign key ("queue_id") references "queue" ("id") on update cascade;');
  }

}
