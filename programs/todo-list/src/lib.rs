use anchor_lang::prelude::*;

declare_id!("AeoSC64agWXiFRTJwS61YudatjyktJP51J5PdWA9L85i");

#[program]
pub mod todo_list {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let todo_list = &mut ctx.accounts.todo_list;
        todo_list.items = Vec::new();
        Ok(())
    }

    pub fn add_item(ctx: Context<AddItem>, item: String) -> Result<()> {
        let todo_list = &mut ctx.accounts.todo_list;
        todo_list.items.push(item);
        Ok(())
    }

    pub fn remove_item(ctx: Context<RemoveItem>, index: u64) -> Result<()> {
        let todo_list = &mut ctx.accounts.todo_list;
        todo_list.items.remove(index as usize);
        Ok(())
    }

    pub fn get_items(ctx: Context<GetItems>) -> Result<()> {
        let todo_list = &ctx.accounts.todo_list;
        msg!("Items: {:?}", todo_list.items);
        Ok(())
    }

    pub fn get_item(ctx: Context<GetItem>, index: u64) -> Result<()> {
        let todo_list = &ctx.accounts.todo_list;
        msg!("Item: {:?}", todo_list.items[index as usize]);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = signer, seeds = [b"todo_list"], bump, space = 200)]
    pub todo_list: Account<'info, TodoList>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AddItem<'info> {
    #[account(mut)]
    pub todo_list: Account<'info, TodoList>,
    pub signer: Signer<'info>,
}

#[derive(Accounts)]
pub struct RemoveItem<'info> {
    #[account(mut)]
    pub todo_list: Account<'info, TodoList>,
    pub signer: Signer<'info>,
}

#[derive(Accounts)]
pub struct GetItems<'info> {
    pub todo_list: Account<'info, TodoList>,
}

#[derive(Accounts)]
pub struct GetItem<'info> {
    pub todo_list: Account<'info, TodoList>,
}

#[account]
pub struct TodoList {
    pub items: Vec<String>,
}   

