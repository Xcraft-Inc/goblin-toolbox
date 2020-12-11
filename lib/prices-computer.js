const {BigNumber} = require('bignumber.js');

const testBasket1 = {
  articles: [
    {
      reference: 'CC',
      description: 'Crésus Comptabilité',
      quantity: '1',
      basePrice: '550',
      options: [
        {
          reference: 'CC-150k',
          description: "150'000 écritures",
          basePrice: '110',
        },
        {
          reference: 'CC-A',
          description: 'Comptabilité analytique',
          basePrice: '200',
        },
      ],
    },
    {
      reference: 'CF',
      description: 'Crésus Facturation',
      quantity: '3',
      basePrice: '550',
      options: [
        {
          reference: 'CF-LARGO',
          description: 'Version LARGO',
          basePrice: '550',
        },
      ],
    },
  ],
  parameters: {
    licensing: 'subscription',
    periodicity: 'yearly',
    hasUpdates: true,
    hasCloud: false,
    cloudUsers: '5',
    discount: '0.2',
  },
};

function compute(basket) {
  const result = {
    prices: [],
    invoice: [],
  };

  let totalOnce = new BigNumber(0);
  let totalRecurrent = new BigNumber(0);

  for (const article of basket.articles) {
    let price = new BigNumber(article.basePrice);

    if (article.options) {
      for (const option of article.options) {
        price = price.plus(new BigNumber(option.basePrice));
      }
    }

    price = price.times(new BigNumber(article.quantity));

    if (basket.parameters.discount) {
      price = price.times(
        new BigNumber(1).minus(new BigNumber(basket.parameters.discount))
      );
    }

    let priceOnce = new BigNumber(0);
    let priceRecurrent = new BigNumber(0);

    if (basket.parameters.licensing === 'permanent') {
      priceOnce = price;
      if (basket.parameters.hasUpdates) {
        priceRecurrent = price.times(0.2);
      }
    }
    if (basket.parameters.licensing === 'subscription') {
      priceRecurrent = price.times(0.04);
    }

    result.invoice.push({
      description: article.description,
      quantity: article.quantity,
      priceOnce: priceOnce,
      priceRecurrent: priceRecurrent,
    });

    if (article.options) {
      for (const option of article.options) {
        result.invoice.push({
          description: option.description,
        });
      }
    }

    totalOnce = totalOnce.plus(priceOnce);
    totalRecurrent = totalOnce.plus(priceRecurrent);
  }

  if (basket.parameters.hasCloud) {
    let priceOnce = new BigNumber(48);
    let priceRecurrent = new BigNumber(basket.parameters.cloudUsers).times(26);

    result.invoice.push({
      description: 'Hébergement cloud',
      priceOnce: priceOnce,
      priceRecurrent: priceRecurrent,
    });

    totalOnce = totalOnce.plus(priceOnce);
    totalRecurrent = totalOnce.plus(priceRecurrent);
  }

  result.prices.push({
    periodicity: 'once',
    netPrice: totalOnce.toString(),
  });
  result.prices.push({
    periodicity: basket.parameters.periodicity,
    netPrice: totalRecurrent.toString(),
  });

  result.invoice.push({
    description: 'Total',
    priceOnce: totalOnce,
    priceRecurrent: totalRecurrent,
  });

  return result;
}

//-----------------------------------------------------------------------------

module.exports = {
  compute,
};
