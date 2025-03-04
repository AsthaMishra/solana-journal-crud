#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("4A7ezb2idALiqL8JPBRA99i3yXKTeZyb19DjUf5XmiqN");

#[program]
pub mod crud {
    use super::*;

    pub fn create_journal_entry(
        ctx: Context<CreateEntry>,
        title: String,
        message: String,
    ) -> Result<()> {
        let journal_entry = &mut ctx.accounts.journal_entry;
        journal_entry.owner = *ctx.accounts.signer.key;
        journal_entry.title = title;
        journal_entry.message = message;
        Ok(())
    }

    pub fn update_journal_entry(
        ctx: Context<UpdateEntry>,
        _title: String,
        message: String,
    ) -> Result<()> {
        let journal_entry = &mut ctx.accounts.journal_entry;
        journal_entry.message = message;
        Ok(())
    }

    pub fn delete_journal_entry(_ctx: Context<DeleteEntry>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(title: String)]
pub struct DeleteEntry<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
      mut,
      close = signer,
      seeds = [title.as_bytes(),signer.key().as_ref()],
      bump,
  )]
    pub journal_entry: Account<'info, JournalEntry>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(title: String)]
pub struct UpdateEntry<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
      mut,
      realloc = 8 + JournalEntry::INIT_SPACE,
      realloc::zero = true,
      realloc::payer = signer,
      seeds = [title.as_bytes(),signer.key().as_ref()],
      bump,
  )]
    pub journal_entry: Account<'info, JournalEntry>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(title: String)]
pub struct CreateEntry<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
      init,
      payer = signer,
      space = 8 + JournalEntry::INIT_SPACE,
      seeds = [title.as_bytes(),signer.key().as_ref()],
      bump,
  )]
    pub journal_entry: Account<'info, JournalEntry>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct JournalEntry {
    pub owner: Pubkey,
    #[max_len(50)]
    pub title: String,
    #[max_len(500)]
    pub message: String,
}
