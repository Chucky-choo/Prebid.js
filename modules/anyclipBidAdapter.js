import {BANNER, VIDEO} from '../src/mediaTypes.js';
import {registerBidder} from '../src/adapters/bidderFactory.js';
import {
  buildRequests,
  getUserSyncs,
  interpretResponse,
  isBidRequestValid,
  onBidBillable,
  onBidderError,
  onBidWon,
  onTimeout,
} from '../libraries/xeUtils/bidderUtils.js';

const BIDDER_CODE = 'anyclip';
const ENDPOINT = 'https://prebid.anyclip.com';

export const spec = {
  code: BIDDER_CODE,
  aliases: ['anyclip'],
  supportedMediaTypes: [BANNER, VIDEO],
  isBidRequestValid: bid => isBidRequestValid(bid, ['publisherId', 'supplyTagId']),
  buildRequests: (validBidRequests, bidderRequest) => {
    const builtRequests = buildRequests(validBidRequests, bidderRequest, ENDPOINT)
    const requests = JSON.parse(builtRequests.data)
    const updatedRequests = requests.map(req => ({
      ...req,
      env: {
        publisherId: validBidRequests[0].params.publisherId,
        supplyTagId: validBidRequests[0].params.supplyTagId,
        floor: req.floor
      },
    }))
    return {...builtRequests, data: JSON.stringify(updatedRequests)}
  },
  interpretResponse,
  getUserSyncs,
  onBidWon,
  onBidBillable,
  onTimeout,
  onBidderError
}

registerBidder(spec);
