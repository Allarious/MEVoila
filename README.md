# MEVoila

MEVoila is a pattern extractor that is designed to crawl ethereum blocks and identify malicious patterns related to censorship and PGAs using only on-chain data.

## How it works

To identify a pattern, MEVoila replays failed transactions at previous indexes and blocks and checks to see if the status changes. If there is a close proximity that allows a failed transaction to be successful, we call that transaction a rational failed transaction. The failed transactions that can not be run in any of those positions that the transaction is replayed in, are called irrational failed transactions.

### Rational Failed Transactions

We consider rational failed transactions were aiming to be included in a certain position to capture an opportunity. However, they were unfortunate enough to be included by block builders in a position that the opportunity was already captured. This happens regularly since opportunity capturing is a competitive task, especially on popular network like Ethereum. Many opportunity capturing transactions rather fail in case of the opportunity not being available anymore, since they tend to use a huge amount of gas, these transactions are called [checked MEV](https://medium.com/flashbots/quantifying-mev-introducing-mev-explore-v0-5ccbee0f6d02).
We categorize the reason of rational transactions failing in several categories:

* It was a part of a PGA and lost.
* It was front-ran by another transaction.
* It was censored by block builders and included after the opportunity was captured.
* It was actually sent late to the network by the sender

