declare module "otp-without-db" {
    /**
     * 
     * @param phone 
     * @param opt 
     * @param key 
     * @param expiresAfter 
     * @param algorithm 
     * 
     * @returns {string} The generated hash string.
     */
    export function createNewOTP(
        phone: string,
        opt: string,
        key?: string,
        expiresAfter?: number,
        algorithm?: string,
    ): string;
    
    /**
     * 
     * @param phone 
     * @param opt 
     * @param hash 
     * @param key 
     * @param algorithm
     * 
     * @returns {boolean} A boolean value determining if valid or not.
     */
    export function verifyOTP(
        phone: string,
        opt: string,
        hash: string,
        key?: string,
        algorithm?: string,
    ): boolean;
}