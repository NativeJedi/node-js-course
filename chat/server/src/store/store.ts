import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'node:fs/promises';
import { access } from 'node:fs/promises';
import { constants } from 'node:fs';
import { UserDTO } from '../dto/user.dto';
import { ChatDTO } from '../dto/chat.dto';
import { MessageDTO } from '../dto/message.dto';

async function isFileExists(path: string): Promise<boolean> {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

type DB = {
  users: Array<UserDTO>;
  chats: Array<ChatDTO>;
  messages: Array<MessageDTO>;
};

const nullDB: DB = {
  users: [],
  chats: [],
  messages: [],
};

const DB_PATH = './db/db.json';

const read = async () => {
  const data = await fs.readFile(DB_PATH, 'utf-8');
  const db = JSON.parse(data) as DB;

  return db;
};

const write = (db: DB) => fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));

@Injectable()
export class Store implements OnModuleInit {
  async readByKey<K extends keyof DB>(key: K): Promise<DB[K]> {
    const data = await read();

    return data[key];
  }

  async writeByKey<K extends keyof DB>(key: K, value: DB[K]): Promise<void> {
    const db = await read();

    const updatedDB = {
      ...db,
      [key]: value,
    };

    await write(updatedDB);
  }

  onModuleInit() {
    isFileExists(DB_PATH).then(async (isExists) => {
      if (isExists) return;

      await write(nullDB);
      console.log('Created empty DB');
    });
  }
}
