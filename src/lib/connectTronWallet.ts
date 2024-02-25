export const connectTronWallet = () => {
  return new Promise(async (resolve, reject) => {
    try {
      //@ts-ignore
      await window["tronLink"]?.request({
        method: "tron_requestAccounts",
        params: {
          websiteName: "receive.me",
        },
      }); //@ts-ignore
      let tronLink = { ...(await window["tronLink"]) };
      let walletAddress = tronLink.tronWeb.defaultAddress.base58;
      const wallets = localStorage.getItem("wallets")
        ? JSON.parse(localStorage.getItem("wallets")!)
        : [];

      let walletIndex = wallets.findIndex(
        (wallet: { walletProvider: string }) => wallet.walletProvider == "tron"
      );

      if (walletIndex < 0)
        wallets.push({
          walletProvider: "tron",
          walletAddress: walletAddress,
        });
      localStorage.setItem("wallets", JSON.stringify(wallets));
      if (!walletAddress) return reject();
      return resolve({ walletAddress, chain: "tron" });
    } catch (e) {
      // console.log(e);
      return reject(e);
    }
  });
};
