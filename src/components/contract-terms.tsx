import {
    captureContractTerms,
    savedContractTerms,
    contractTermsText,
} from "@/server/contracts";
import { ContractTermsDialog } from "./contract-terms-dialog";

export async function ContractTerms({ snapshot }: { snapshot: unknown }) {
    const terms =
        savedContractTerms(snapshot) ?? (await captureContractTerms());
    return <ContractTermsDialog text={contractTermsText(terms)} />;
}
