# Overview

```
Module Name: Digital Matter Bidder Adapter
Module Type: Digital Matter Bidder Adapter
Maintainer: prebid@digitalmatter.ai
```

# Description

Module that connects to digitalmatter.ai demand sources

# Test Parameters
```
var adUnits = [
    {
        code: 'test-banner',
        mediaTypes: {
            banner: {
                sizes: [[300, 250]],
            }
        },
        bids: [
            {
                bidder: 'digitalmatter',
                params: {
                    env: 'digitalmatter',
                    pid: '40',
                    ext: {}
                }
            }
        ]
    },
    {
        code: 'test-video',
        sizes: [ [ 640, 480 ] ],
        mediaTypes: {
            video: {
                playerSize: [640, 480],
                context: 'instream',
                skipppable: true
            }
        },
        bids: [{
            bidder: 'digitalmatter',
            params: {
                env: 'digitalmatter',
                pid: '40',
                ext: {}
            }
        }]
    }
];
```
