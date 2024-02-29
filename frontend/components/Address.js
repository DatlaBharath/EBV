import { useState, useEffect } from "react";

export default function Address() {
  const [address, setAddress] = useState("");

  useEffect(() => {
     const updateAddress = async () => {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        setAddress(accounts[0]);
      } catch (err) {
        console.error(err);
      }
    };

    window.ethereum.on("accountsChanged", updateAddress);

    return () => {
      window.ethereum.removeListener("accountsChanged", updateAddress);
    };
  }, []);

  return (
    <div>
      <p>Address: {address}</p>
    </div>
  );
}
