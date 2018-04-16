/**
 * Transaction
 */
export interface Transaction {

    /**
     * Interface level-declarations.
     */
    hash: string;
    type: number;
    from: string;
    to: string;
    value: number;
    data: string;
    gas: number;
    time: number; // Milliseconds
    signature: string;
    fromName: string; // Transient
    toName: string; // Transient
}
