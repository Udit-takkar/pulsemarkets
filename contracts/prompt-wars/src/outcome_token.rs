use near_sdk::{env, log, AccountId};
use shared::OutcomeId;

use crate::{
    storage::{OutcomeToken, WrappedBalance},
    OutcomeTokenResult,
};

impl Default for OutcomeToken {
    fn default() -> Self {
        panic!("OutcomeToken should be initialized before usage")
    }
}

impl OutcomeToken {
    pub fn new(outcome_id: &OutcomeId, prompt: String, initial_supply: WrappedBalance) -> Self {
        Self {
            outcome_id: outcome_id.clone(),
            prompt,
            result: None,
            total_supply: initial_supply,
        }
    }

    pub fn burn(&mut self, account_id: &AccountId, amount: WrappedBalance) {
        let balance = self.get_balance_of();

        assert!(balance >= amount, "ERR_BURN_INSUFFICIENT_BALANCE");

        self.total_supply -= amount;

        log!(
            "Burned {} of outcome_id [{}] for {}. Supply: {}",
            amount,
            self.outcome_id,
            account_id,
            self.total_supply()
        );
    }

    pub fn set_result(&mut self, result: OutcomeTokenResult) {
        if let Some(r) = self.result {
            env::panic_str("ERR_SET_RESULT_ALREADY_SET");
        }

        self.result = Some(result);
    }

    pub fn get_balance_of(&self) -> WrappedBalance {
        self.total_supply
    }

    pub fn total_supply(&self) -> WrappedBalance {
        self.total_supply
    }

    pub fn outcome_id(&self) -> OutcomeId {
        self.outcome_id.clone()
    }

    pub fn get_prompt(&self) -> String {
        self.prompt.clone()
    }

    pub fn get_result(&self) -> Option<OutcomeTokenResult> {
        self.result
    }
}
