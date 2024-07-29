# Overview

```
Module Name: digital Matter Bidder Adapter
Module Type: digital Matter Bidder Adapter
Maintainer: developer@digital_matter.ai
```

# Description

Module that connects to digital_matter.com demand sources

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
                bidder: 'digital_matter',
                params: {
                    env: 'digital_matter',
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
            bidder: 'digital_matter',
            params: {
                env: 'digital_matter',
                pid: '40',
                ext: {}
            }
        }]
    }
];
```
