use soroban_sdk::{Env, Address, BytesN};
use crate::types::{DataKey, CreditMetadata};

pub fn set_admin(env: &Env, admin: &Address) {
    env.storage().instance().set(&DataKey::Admin, admin);
}

pub fn get_admin(env: &Env) -> Option<Address> {
    env.storage().instance().get(&DataKey::Admin)
}

pub fn has_admin(env: &Env) -> bool {
    env.storage().instance().has(&DataKey::Admin)
}

pub fn set_credit(env: &Env, id: &BytesN<32>, metadata: &CreditMetadata) {
    env.storage().persistent().set(&DataKey::Credit(id.clone()), metadata);
}

pub fn get_credit(env: &Env, id: &BytesN<32>) -> Option<CreditMetadata> {
    env.storage().persistent().get(&DataKey::Credit(id.clone()))
}

pub fn is_verifier(env: &Env, verifier: &Address) -> bool {
    let verifiers: Option<soroban_sdk::Vec<Address>> = env.storage().instance().get(&DataKey::VerifierSet);
    match verifiers {
        Some(set) => set.contains(verifier),
        None => false,
    }
}
