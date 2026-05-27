use soroban_sdk::contracterror;

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum CarbonChainError {
    NotInitialized = 100,
    AlreadyInitialized = 101,
    Unauthorized = 102,
    InvalidMetadata = 103,
    CreditNotFound = 104,
    InvalidStatusTransition = 105,
    VerifierAlreadyExists = 106,
    VerifierNotFound = 107,
    InsufficientBalance = 108,
    Overflow = 109,
    InvalidTonnes = 110,
    InvalidAdmin = 111,
    ContractPaused = 112,
    IssuerNotAllowed = 113,
    InvalidMethodology = 114,
    InvalidNonce = 115,
    NoPendingAdmin = 116,
    InvalidSplit = 117,
    InvalidDisputeStatus = 118,
    /// Returned when trying to remove a verifier who still has Pending credits.
    VerifierHasPendingCredits = 119,
    ProjectNotFound = 120,
    ProjectAlreadyExists = 121,
    SessionNotFound = 122,
    /// Returned when `required_approvals` is set to zero or exceeds the verifier count.
    InvalidApprovalThreshold = 123,
    /// Returned when a verifier tries to approve a credit they already approved.
    AlreadyApproved = 124,
}
