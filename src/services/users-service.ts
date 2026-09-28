import { eq } from "drizzle-orm";
import { db } from "../db";
import { users, sessions } from "../db/schema";

export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginUserInput {
  email: string;
  password: string;
}

export class UserService {
  static async register(input: RegisterUserInput) {
    // 1. Cek apakah email sudah terdaftar
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, input.email))
      .limit(1);

    if (existingUser.length > 0) {
      throw new Error("Email sudah terdaftar");
    }

    // 2. Hash password menggunakan bcrypt
    const hashedPassword = await Bun.password.hash(input.password, {
      algorithm: "bcrypt",
      cost: 10,
    });

    // 3. Simpan ke database
    await db.insert(users).values({
      name: input.name,
      email: input.email,
      password: hashedPassword,
    });

    return { success: true };
  }

  static async login(input: LoginUserInput) {
    // 1. Cari user berdasarkan email
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, input.email))
      .limit(1);

    if (!user) {
      throw new Error("Email atau password salah");
    }

    // 2. Verifikasi hash password
    const isPasswordValid = await Bun.password.verify(input.password, user.password);
    if (!isPasswordValid) {
      throw new Error("Email atau password salah");
    }

    // 3. Generate UUID token
    const token = crypto.randomUUID();

    // 4. Simpan session ke database
    await db.insert(sessions).values({
      token,
      userId: user.id,
    });

    return { token };
  }
}
