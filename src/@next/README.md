# Welcome to the next phase!

This is the directory for the {{ config.appName }}, formerly known as the Data
Tracker.
The plan is for new functionality of the {{ config.appName }} to be implemented
here while old functionality of the Data Tracker slowly incorporates the code
here until it can be moved in completely.
The result will be a more thought-out, better-architected application that
will allow for more consistent design, easier additions, and increased
flexibility.

## UIKit

The `components` directory contains React components organized according to
[Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/).
New components may be quickly created using the plop command:

```
> yarn plop                                                                                                                                                                             
? Choose component type atoms
? Enter component name My Component
```
This will bootstrap a new component into the proper category and setup a Cosmos
fixture for it.

[React Cosmos](https://reactcosmos.org/) is used for reviewing available
components and developing new ones.
It may be lanched like so:
```
FAST_REFRESH=false yarn cosmos
```
