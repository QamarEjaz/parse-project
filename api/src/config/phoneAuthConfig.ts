export class PhoneAuthConfig {
    static readonly verificatioCodeValiDuration = 10 as const; // in minutes

    static readonly verificationCodeLength = 4 as const;

    static readonly verificationCodeSecret = "kUTdUhguBCOEDmnfEIjk" as const;

    static readonly testPhoneNumbers = [
        "3212913398",
        "9163043626",
        "9353684712", // Musthafa
    ] as const;

    static readonly testOtp = "5432" as const;
}