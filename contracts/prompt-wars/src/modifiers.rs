use near_sdk::{env, near_bindgen, AccountId};
use shared::OutcomeId;

use crate::storage::*;

#[near_bindgen]
impl Market {
    pub fn assert_price(&self, amount: WrappedBalance) {
        if amount < self.fees.price {
            env::panic_str("ERR_ASSERT_PRICE_TOO_LOW");
        }
    }

    pub fn assert_is_not_resolved(&self) {
        if self.is_resolved() {
            env::panic_str("ERR_MARKET_RESOLVED");
        }
    }

    pub fn assert_is_resolved(&self) {
        if !self.is_resolved() {
            env::panic_str("ERR_MARKET_NOT_RESOLVED");
        }
    }

    pub fn assert_fees_not_claimed(&self) {
        if self.fees.claimed_at.is_some() {
            env::panic_str("ERR_FEES_CLAIMED");
        }
    }

    pub fn assert_is_winner(&self, player_id: &AccountId) {
        if let Some(winner) = &self.resolution.result {
            if winner != player_id {
                env::panic_str("ERR_PLAYER_IS_NOT_WINNER");
            }
        }
    }

    pub fn assert_is_open(&self) {
        if !self.is_open() {
            env::panic_str("ERR_MARKET_IS_CLOSED");
        }
    }

    pub fn assert_is_resolution_window_open(&self) {
        if self.is_reveal_window_expired() && self.is_resolution_window_expired() {
            env::panic_str("ERR_RESOLUTION_WINDOW_EXPIRED");
        }
    }

    pub fn assert_is_resolution_window_expired(&self) {
        if !self.is_resolution_window_expired() {
            env::panic_str("ERR_RESOLUTION_WINDOW_NOT_EXPIRED");
        }
    }

    pub fn assert_is_reveal_window_open(&self) {
        if self.is_reveal_window_expired() {
            env::panic_str("ERR_REVEAL_WINDOW_EXPIRED");
        }
    }

    pub fn assert_only_player(&self, outcome_id: OutcomeId, account_id: AccountId) {
        if outcome_id != account_id {
            env::panic_str("ERR_SIGNER_IS_NOT_PLAYER");
        }
    }

    pub fn assert_only_owner(&self) {
        if env::signer_account_id() != self.management.market_creator_account_id {
            env::panic_str("ERR_SIGNER_IS_NOT_OWNER");
        }
    }

    pub fn assert_is_valid_outcome(&self, outcome_id: &OutcomeId) {
        self.get_outcome_token(outcome_id);
    }
}
