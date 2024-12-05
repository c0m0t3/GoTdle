import bcrypt from 'bcrypt';

export class PasswordHasher {
  constructor(private readonly salt: number) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hashSync(password, this.salt);
  }

  // Funktion, um ein Passwort mit einem Hash zu vergleichen
  async comparePasswordsWithHash(
    password: string,
    hash: string,
  ): Promise<boolean> {
    try {
      const isMatch = await bcrypt.compareSync(password, hash);

      return isMatch;
    } catch (error) {
      console.error('Fehler beim Vergleichen der Passwörter:', error);
      return false;
    }
  }
}
