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
    hasUpdates: 'true',
    hasCloud: 'false',
    cloudUsers: 'false',
    discount: '0.2',
  },
};

function compute(N, basket) {
  const result = {
    prices: [],
    invoice: [],
  };

  let totalOnce = new N(0);
  let totalRecurrent = new N(0);

  for (const article of basket.articles) {
    let price = new N(article.basePrice);

    if (article.options) {
      for (const option of article.options) {
        price = price.add(new N(option.basePrice));
      }
    }

    price = price.mul(new N(article.quantity));

    if (basket.parameters.discount) {
      price = price.mul(new N(1).sub(new N(basket.parameters.discount)));
    }

    let priceOnce = new N(0);
    let priceRecurrent = new N(0);

    if (basket.parameters.licensing === 'permanent') {
      priceOnce = price;
      if (basket.parameters.hasUpdates === 'true') {
        priceRecurrent = price.mul(0.2);
      }
    }
    if (basket.parameters.licensing === 'subscription') {
      priceRecurrent = price.mul(0.04);
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

    totalOnce = totalOnce.add(priceOnce);
    totalRecurrent = totalOnce.add(priceRecurrent);
  }

  if (basket.parameters.hasCloud === 'true') {
    let priceOnce = new N(48);
    let priceRecurrent = new N(basket.parameters.cloudUsers).mul(26);

    result.invoice.push({
      description: 'Hébergement cloud',
      priceOnce: priceOnce,
      priceRecurrent: priceRecurrent,
    });

    totalOnce = totalOnce.add(priceOnce);
    totalRecurrent = totalOnce.add(priceRecurrent);
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
