import {deepAccess, logError, isArray} from '../../src/utils.js';
import {ajax} from '../../src/ajax.js';
import {ortbConverter} from "../ortbConverter/converter.js";

const BID_TRACKING_ENDPOINT = 'https://your.analytics.endpoint';

/**
 * Universal handler for when a bid is won.
 * @param {Object} bid
 */
export function onBidWon(bid) {
  try {
    const payload = buildPayload(bid, 'bidWon');
    sendTracking(`${BID_TRACKING_ENDPOINT}/won`, payload);
  } catch (e) {
    logError('Error in onBidWon:', e);
  }
}

/**
 * Universal handler for when a bid becomes billable.
 * @param {Object} bid
 */
export function onBidBillable(bid) {
  try {
    const payload = buildPayload(bid, 'bidBillable');
    sendTracking(`${BID_TRACKING_ENDPOINT}/billable`, payload);
  } catch (e) {
    logError('Error in onBidBillable:', e);
  }
}

/**
 * Internal utility for sending tracking payload
 * Uses Prebid-safe ajax() instead of restricted sendBeacon
 * @param {string} url
 * @param {Object} payload
 */
function sendTracking(url, payload) {
  ajax(url, null, JSON.stringify(payload), {
    method: 'POST',
    contentType: 'application/json'
  });
}

/**
 * Build a standard payload from bid and event type
 * @param {Object} bid
 * @param {string} eventType
 */
function buildPayload(bid, eventType) {
  return {
    event: eventType,
    bidId: bid.bidId,
    adUnitCode: bid.adUnitCode,
    bidder: bid.bidder,
    cpm: bid.cpm,
    currency: bid.currency,
    creativeId: bid.creativeId,
    width: bid.width,
    height: bid.height,
    timestamp: Date.now()
  };
}

// --- ORTB BID REQUEST BUILDER ---
export const converter = ortbConverter({
  context: {
    mediaType: '*',
    bidRequest: true
  },
  imp(buildImp, bidRequest) {
    buildImp.ext = {
      bidder: {
        env: bidRequest.params.env,
        pid: bidRequest.params.pid,
        ext: bidRequest.params.ext
      }
    };

    if (bidRequest.mediaTypes?.video) {
      buildImp.video = bidRequest.mediaTypes.video;
    }
  }
});

/**
 * Build ORTB-compliant server request using converter
 * @param {Array} validBidRequests
 * @param {Object} bidderRequest
 * @param {string} endpoint
 * @returns {Object}
 */
export function buildRequests(validBidRequests, bidderRequest, endpoint) {
  const ortbRequest = converter.toORTB({
    bidRequests: validBidRequests,
    bidderRequest
  });

  return {
    method: 'POST',
    url: `${endpoint}/bid`,
    data: JSON.stringify(ortbRequest),
    withCredentials: true,
    bidderRequest,
    options: {
      contentType: 'application/json'
    }
  };
}

/**
 * Convert ORTB response to Prebid bid array
 * @param {Object} serverResponse
 * @returns {Array}
 */
export function interpretResponse(serverResponse) {
  return converter.fromORTB({
    response: serverResponse.body
  }).bids || [];
}

export function getUserSyncs(syncOptions, serverResponses, gdprConsent = {}, uspConsent = '') {
  const syncs = [];
  const pixels = deepAccess(serverResponses, '0.body.data.0.ext.pixels');

  if ((syncOptions.iframeEnabled || syncOptions.pixelEnabled) && isArray(pixels) && pixels.length !== 0) {
    const gdprFlag = `&gdpr=${gdprConsent.gdprApplies ? 1 : 0}`;
    const gdprString = `&gdpr_consent=${encodeURIComponent((gdprConsent.consentString || ''))}`;
    const usPrivacy = `us_privacy=${encodeURIComponent(uspConsent)}`;

    pixels.forEach(pixel => {
      const [type, url] = pixel;
      const sync = {type, url: `${url}&${usPrivacy}${gdprFlag}${gdprString}`};
      if (type === 'iframe' && syncOptions.iframeEnabled) {
        syncs.push(sync)
      } else if (type === 'image' && syncOptions.pixelEnabled) {
        syncs.push(sync)
      }
    });
  }

  return syncs;
}
