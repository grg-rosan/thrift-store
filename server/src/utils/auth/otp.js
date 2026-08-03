import { prisma } from '../lib/prisma.js';
import { generateOtp, hashOtp, verifyOtpHash, isOtpExpired } from '../utils/auth/otp.js';
import { Errors } from '../utils/error/error.js';

const ISSUANCE_WINDOW_MS = 15 * 60 * 1000;
const MAX_ISSUANCE_PER_WINDOW = 3;
const IS_PROD = process.env.NODE_ENV === 'production';

export async function requestOtp(phoneNumber) {
  const windowStart = new Date(Date.now() - ISSUANCE_WINDOW_MS);

  const recentCount = await prisma.otpRequest.count({
    where: { phoneNumber, createdAt: { gte: windowStart } },
  });
  if (recentCount >= MAX_ISSUANCE_PER_WINDOW) {
    throw Errors.RATE_LIMITED();
  }

  const { otp, expiresAt } = generateOtp();
  const codeHash = hashOtp(otp);

  await prisma.otpRequest.create({
    data: { phoneNumber, codeHash, expiresAt },
  });

  // ─── DEV MODE (active) ───────────────────────────────────────────
  // Returns the raw OTP directly so you can read it off the API response
  // or console during local testing. This branch is hard-blocked in
  // production regardless of what the caller does with the return value.
  if (!IS_PROD) {
    console.log(`[DEV OTP] ${phoneNumber} -> ${otp}`);
    return { devOtp: otp };
  }

  // ─── PRODUCTION MODE (commented — uncomment when ready) ─────────
  // Swap in your SMS provider here. Twilio example:
  //
  // import twilio from 'twilio';
  // const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
  //
  // await client.messages.create({
  //   to: phoneNumber,
  //   from: process.env.TWILIO_FROM_NUMBER,
  //   body: `Your Karrot verification code is ${otp}. Expires in 5 minutes.`,
  // });
  //
  // return { devOtp: null }; // never return the raw code in prod

  // Currently: if IS_PROD is true and the block above is still commented,
  // fail loudly instead of silently returning nothing — better to crash in
  // staging than ship a login flow with no SMS delivery.
  throw new Error('SMS provider not configured — uncomment the production block in otp.service.js');
}

export async function verifyOtp(phoneNumber, submittedOtp) {
  const record = await prisma.otpRequest.findFirst({
    where: { phoneNumber, consumedAt: null },
    orderBy: { createdAt: 'desc' },
  });

  if (!record) throw Errors.INVALID_OTP();
  if (isOtpExpired(record.expiresAt)) throw Errors.INVALID_OTP();
  if (record.attempts >= record.maxAttempts) throw Errors.INVALID_OTP();

  const valid = verifyOtpHash(submittedOtp, record.codeHash);

  if (!valid) {
    await prisma.otpRequest.update({
      where: { id: record.id },
      data: { attempts: { increment: 1 } },
    });
    throw Errors.INVALID_OTP();
  }

  await prisma.otpRequest.update({
    where: { id: record.id },
    data: { consumedAt: new Date() },
  });

  return true;
}