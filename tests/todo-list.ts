import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TodoList } from "../target/types/todo_list";
import { expect } from "chai";

describe("todo-list", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.TodoList as Program<TodoList>;
  const provider = anchor.getProvider();

  it("Initializes the todo list", async () => {
    const [todoListPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("todo_list")],
      program.programId
    );

    const tx = await program.methods
      .initialize()
      .accounts({
        todoList: todoListPda,
        signer: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("Your transaction signature", tx);

    const account = await program.account.todoList.fetch(todoListPda);
    expect(account.items).to.be.empty;
  });

  it("Adds an item to the todo list", async () => {
    const [todoListPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("todo_list")],
      program.programId
    );

    const item = "Buy groceries";
    await program.methods
      .addItem(item)
      .accounts({
        todoList: todoListPda,
        signer: provider.wallet.publicKey,
      })
      .rpc();

    const account = await program.account.todoList.fetch(todoListPda);
    expect(account.items).to.have.lengthOf(1);
    expect(account.items[0]).to.equal(item);
  });

  it("Gets all items from the todo list", async () => {
    const [todoListPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("todo_list")],
      program.programId
    );

    await program.methods
      .getItems()
      .accounts({
        todoList: todoListPda,
      })
      .rpc();

    // Note: We can't directly assert the console output,
    // but we can check the account state
    const account = await program.account.todoList.fetch(todoListPda);
    expect(account.items).to.have.lengthOf(1);
  });

  it("Gets a specific item from the todo list", async () => {
    const [todoListPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("todo_list")],
      program.programId
    );

    await program.methods
      .getItem(new anchor.BN(0))
      .accounts({
        todoList: todoListPda,
      })
      .rpc();

    // Again, we can't assert console output, but we can check the account state
    const account = await program.account.todoList.fetch(todoListPda);
    expect(account.items[0]).to.equal("Buy groceries");
  });

  it("Removes an item from the todo list", async () => {
    const [todoListPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("todo_list")],
      program.programId
    );

    await program.methods
      .removeItem(new anchor.BN(0))
      .accounts({
        todoList: todoListPda,
        signer: provider.wallet.publicKey,
      })
      .rpc();

    const account = await program.account.todoList.fetch(todoListPda);
    expect(account.items).to.be.empty;
  });
});
