#![no_std]
use soroban_sdk::{contract, contractimpl, Env, Address, String, BytesN};

pub mod types;
pub mod errors;
pub mod storage;

use crate::errors::CarbonChainError;
use crate::storage::{set_admin, has_admin};

#[contract]
pub struct CreditRegistry;

#[contractimpl]
impl CreditRegistry {
    pub fn initialize(env: Env, admin: Address) -> Result<(), CarbonChainError> {
        if has_admin(&env) {
            return Err(CarbonChainError::AlreadyInitialized);
        }
        set_admin(&env, &admin);
        Ok(())
    }

    pub fn submit_credit(env: Env, _issuer: Address, _project_id: String, _tonnes: i128) -> BytesN<32> {
        // TODO: Implementation
        BytesN::from_array(&env, &[0u8; 32])
    }
}
