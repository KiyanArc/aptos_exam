import { Account, Ed25519PrivateKey, Network, AptosConfig, Aptos, PrivateKey, PrivateKeyVariants } from "@aptos-labs/ts-sdk";

const formattedPrivateKey = PrivateKey.formatPrivateKey(
  "0x365afd87f578f2d9b6c1ce694d436b91b0f3db9106a9d8f3a04bc63b8bb4c8c6", 
  PrivateKeyVariants.Ed25519);

async function main() {
    const config = new AptosConfig( {network: Network.TESTNET} );
    const aptos = new Aptos(config);

    const PRIVATE_KEY = new Ed25519PrivateKey(formattedPrivateKey);

    const MY_ACCOUNT = Account.fromPrivateKey({
        privateKey: PRIVATE_KEY,
    });

    const myBalance = await aptos.getAccountAPTAmount({
        accountAddress: MY_ACCOUNT.accountAddress,
    });

    const transaction = await aptos.transaction.build.simple({
        sender: MY_ACCOUNT.accountAddress,
        data: {
          function:
            "0x777b93e13ff2a1bc872eb4d099ae15a52fb70f2f01dd18d7c809e217fb0e543e::tba_exam::add_participant",
          functionArguments: [
            "0x539f880b3da2bc33d98b5efbf611eb76b6a980b0fdb15badb537767e0767d6e3",
            "Duncan Red Benedict C. De Guzman",
            "https://github.com/KiyanArc",
            "princedunc1214@gmail.com",
            "redartet",
          ],
        },
      });

      const senderAuthenticator = aptos.transaction.sign({
        signer: MY_ACCOUNT,
        transaction,
      });

      const pendingTransaction = await aptos.transaction.submit.simple({
        transaction,
        senderAuthenticator,
      });

      const txnResult = await aptos.waitForTransaction({
        transactionHash: pendingTransaction.hash,
      });

      console.log(
        `Transaction completed with status: ${
            txnResult.success ? "SUCCESS" : "FAILURE"
        }`
      );
}

main().catch(console.error);

