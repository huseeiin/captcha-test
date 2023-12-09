import sharp from "sharp";
import { faker } from "@faker-js/faker";
import { EncryptJWT, jwtDecrypt } from "jose";
import { SECRET } from "$env/static/private";
import { fail } from "@sveltejs/kit";

const encodedSecret = new TextEncoder().encode(SECRET);

export const actions = {
  default: async (e) => {
    const data = Object.fromEntries(await e.request.formData());

    if (typeof data.jwt === "string" && typeof data.answer === "string") {
      try {
        const { payload } = await jwtDecrypt(data.jwt, encodedSecret);

        if (payload.answer === data.answer.trim()) {
          return { success: true };
        } else {
          return fail(400, { error: "You are wrong" });
        }
      } catch {
        return fail(400, { error: "Invalid JWT" });
      }
    }
  },
};

export async function load() {
  const answer = faker.word.noun();

  const captcha = sharp({
    text: { text: answer, width: 640, height: 480 },
  }).png();

  const jwt = await new EncryptJWT({ answer })
    .setProtectedHeader({
      enc: "A128CBC-HS256",
      alg: "dir",
    })
    .encrypt(encodedSecret);

  const buffer = await captcha.toBuffer();

  const img = `data:image/png;base64,${buffer.toString("base64")}`;

  return { img, jwt };
}
