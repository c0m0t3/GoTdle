import { Client } from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

console.log('Seeding...', __dirname);
const usersFilePath = path.join(__dirname, 'docs', 'users.json');
const charactersFilePath = path.join(__dirname, 'docs', 'characters.json');
const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));
const characters = JSON.parse(fs.readFileSync(charactersFilePath, 'utf-8'));

async function seed() {
  try {
    await client.connect();

    for (const user of users) {
      await client.query(
        'INSERT INTO "user" (email, password, username) VALUES ($1, $2, $3)',
        [user.email, user.password, user.username],
      );
    }

    for (const character of characters) {
      const formattedCharacter = {
        ...character,
        titles: character.titles ? `{${character.titles.join(', ')}}` : null,
        spouse: character.spouse ? `{${character.spouse.join(', ')}}` : null,
        children: character.children
          ? `{${character.children.join(', ')}}`
          : null,
        siblings: character.siblings
          ? `{${character.siblings.join(', ')}}`
          : null,
        lovers: character.lovers ? `{${character.lovers.join(', ')}}` : null,
        seasons: character.seasons ? `{${character.seasons.join(', ')}}` : null,
      };

      await client.query(
        'INSERT INTO "character" (_id, name, gender, born, origin, death, status, culture, religion, titles, house, father, mother, spouse, children, siblings, lovers, seasons, actor) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)',
        [
          formattedCharacter._id,
          formattedCharacter.name,
          formattedCharacter.gender,
          formattedCharacter.born,
          formattedCharacter.origin,
          formattedCharacter.death,
          formattedCharacter.status,
          formattedCharacter.culture,
          formattedCharacter.religion,
          formattedCharacter.titles,
          formattedCharacter.house,
          formattedCharacter.father,
          formattedCharacter.mother,
          formattedCharacter.spouse,
          formattedCharacter.children,
          formattedCharacter.siblings,
          formattedCharacter.lovers,
          formattedCharacter.seasons,
          formattedCharacter.actor,
        ],
      );
    }

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.end();
  }
}

seed();
