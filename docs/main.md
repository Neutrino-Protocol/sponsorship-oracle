
# Technical Info

### Main purpose

The main purpose of sponsorship oracle is to keep
minimal sponsored asset fee ("MSAF") value up-to-date

### How does it work

Oracle checks current WAVES price and current "MSAF" value. Then the difference is computed, recency of "MSAF" is the main responsibility of sponsorship oracle. In current formula we depend on "upper bound" value

```
UPPER_BOUND=100
```

which represents Smart Contract profit

### The approach and the problem

#### Approach

Recent implementation lets us configure the update frequency by setting environmental variables.
The default value is 5 minutes.

```
SPONSORSHIP_FREQ=300000
```

#### The problem

Right now, it's impossible to keep saved data in blockchain so the only way to manage is data caching from
the oracle's side