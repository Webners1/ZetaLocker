import React from "react"

function WithdrawSuccessModal() {
  return (
    <div>
      <div className="container-sm p-32">
        <h1 className="mt-0 mb-16">
          Withdrawal <span className="text-color-primary">Successful</span>
        </h1>
        <p className="mt-24 mb-32">
          Your tokens are successfully withdrawn from the Token Locker smart contract and transferred to your wallet.
        </p>
      </div>
    </div>
  )
}

export default WithdrawSuccessModal
