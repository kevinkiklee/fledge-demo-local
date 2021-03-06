/**
 * This is an example bid generation logic. A real-life bid logic will look very different from
 * this example. The purpose of this example is to show the signals available during bid time,
 * and it does not explain how a bid should be made.
 */
function getAdBids(ads, properties) {
  const { isControversial, windowInnerHeight, remainingAdBudget, favoriteColor } = properties;

  return ads.map((ad) => {
    const {
      renderUrl,
      metadata: { adName, allowControversial, productColor },
    } = ad;

    // Initial bid
    let bid = 0;

    // If the product color matches the user's favorite color, increase bid
    if (productColor === favoriteColor) {
      bid += 1;
    }

    // If the page contains controversial content, and the ad doesn't allow it,
    // Set the bid to 0
    if (isControversial && !allowControversial) {
      bid = 0;
    }

    // If there is no budget remaining for the ad campaign, set the
    // bid to 0
    if (remainingAdBudget[adName] <= 0) {
      bid = 0;
    }

    return {
      adName,
      bid,
      renderUrl,
    };
  });
}

function generateBid(interestGroup, auctionSignals, perBuyerSignals, trustedBiddingSignals, browserSignals) {
  const { isControversial } = auctionSignals;
  const { windowInnerHeight } = perBuyerSignals ?? {};
  const { remainingAdBudget } = trustedBiddingSignals;
  const {
    ads,
    userBiddingSignals: { favoriteColor },
  } = interestGroup;

  const adBids = getAdBids(ads, {
    isControversial,
    windowInnerHeight,
    remainingAdBudget,
    favoriteColor,
  });

  // Sort in descending order
  const [{ adName, bid, renderUrl }] = adBids.sort((a, b) => b.bid - a.bid);

  return {
    ad: {
      adName,
    },
    bid,
    render: renderUrl,
  };
}

function reportWin() {
  console.log('report win');
}
